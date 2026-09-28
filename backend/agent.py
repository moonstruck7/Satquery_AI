import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForImageTextToText, BitsAndBytesConfig
from peft import PeftModel

MODEL_ID = "Qwen/Qwen3-VL-4B-Instruct"
ADAPTER_PATH = "./qwen3vl4b-satquery-lora-final/final"

# --- Load once, at import time ---
_bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)

print("[agent] Loading model...")
_processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)
_base_model = AutoModelForImageTextToText.from_pretrained(
    MODEL_ID,
    quantization_config=_bnb_config,
    device_map={"": 0},
    dtype=torch.bfloat16,
    trust_remote_code=True,
)
_model = PeftModel.from_pretrained(_base_model, ADAPTER_PATH)
print("[agent] Model ready.")


def _route(num_images: int, question: str) -> str:
    """Decides which task type this query is, based on image count and keywords."""
    q = question.lower()

    if num_images == 1:
        if any(kw in q for kw in ["locate", "location of", "bounding box", "identify the region", "where is"]):
            return "grounding"
        return "vqa_or_captioning"

    elif num_images == 2:
        if any(kw in q for kw in ["sar", "radar", "optical and sar", "cross-modal"]):
            return "optical_sar"
        if any(kw in q for kw in ["change", "compare", "difference", "differ", "before and after"]):
            return "change_analysis"
        # Ambiguous 2-image case with no clear keyword — default to change analysis
        return "change_analysis"

    else:
        raise ValueError(f"Unsupported number of images: {num_images}")


def _generate(images, question, max_new_tokens):
    content = [{"type": "image", "image": img} for img in images]
    content.append({"type": "text", "text": question})
    messages = [{"role": "user", "content": content}]

    inputs = _processor.apply_chat_template(
        messages, tokenize=True, add_generation_prompt=True, return_tensors="pt", return_dict=True
    ).to(_model.device)

    output = _model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=0.3,
        top_p=0.9,
        repetition_penalty=1.15,
    )
    full_text = _processor.decode(output[0], skip_special_tokens=True)
    return full_text.split("assistant")[-1].strip()


def answer_query(image_paths: list[str], question: str) -> dict:
    """
    Main entry point. Takes 1 or 2 image file paths and a question,
    returns the answer plus an execution trace.
    """
    images = [Image.open(p).convert("RGB") for p in image_paths]
    task_type = _route(len(images), question)

    max_tokens = 1000 if len(images) == 2 else 500
    answer = _generate(images, question, max_tokens)

    return {
        "answer": answer,
        "execution_trace": {
            "task_type": task_type,
            "num_images": len(images),
            "image_paths": image_paths,
            "model": f"{MODEL_ID} + LoRA adapter ({ADAPTER_PATH})",
        }
    }


# --- Quick manual test when run directly ---
if __name__ == "__main__":
    import os
    import random

    all_images = os.listdir("dataset_images")
    test_img = f"dataset_images/{random.choice(all_images)}"

    result = answer_query([test_img], "What is the dominant land cover in this image?")
    print("\n--- Single-image test ---")
    print(result)

    img1, img2 = random.sample(all_images, 2)
    result2 = answer_query(
        [f"dataset_images/{img1}", f"dataset_images/{img2}"],
        "Compare these two satellite images and describe the differences in land cover."
    )
    print("\n--- Two-image test ---")
    print(result2)