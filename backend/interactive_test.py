import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForImageTextToText, BitsAndBytesConfig
from peft import PeftModel
import os
import random

MODEL_ID = "Qwen/Qwen3-VL-4B-Instruct"
ADAPTER_PATH = "./qwen3vl4b-satquery-lora-v2/final"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)

print("Loading model... (only happens once)")
processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)
base_model = AutoModelForImageTextToText.from_pretrained(
    MODEL_ID,
    quantization_config=bnb_config,
    device_map={"": 0},
    dtype=torch.bfloat16,
    trust_remote_code=True,
)
model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
print("Model ready.\n")

def ask(image_path, question, max_new_tokens=1000):
    image = Image.open(image_path).convert("RGB")
    messages = [
        {"role": "user", "content": [
            {"type": "image", "image": image},
            {"type": "text", "text": question}
        ]}
    ]
    inputs = processor.apply_chat_template(
        messages, tokenize=True, add_generation_prompt=True, return_tensors="pt", return_dict=True
    ).to(model.device)

    output = model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=0.3,       # lower = more focused/factual, higher = more varied
        top_p=0.9,
        repetition_penalty=1.15,  # discourages repeating phrases
    )
    full_text = processor.decode(output[0], skip_special_tokens=True)
    # only show the new generated part, not the echoed prompt
    return full_text.split("assistant")[-1].strip()

# --- Interactive loop ---
all_images = os.listdir("dataset_images")

while True:
    cmd = input("\nPress Enter for a random image, or type a filename, or 'quit': ").strip()
    if cmd.lower() == "quit":
        break
    if not cmd:
        image_path = f"dataset_images/{random.choice(all_images)}"
    elif os.path.exists(cmd):
        image_path = cmd
    else:
        image_path = f"dataset_images/{cmd}"
    
    print(f"Using image: {image_path}")

    question = input("Your question: ").strip()
    answer = ask(image_path, question)
    print("\nAnswer:", answer)