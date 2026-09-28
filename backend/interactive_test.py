import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForImageTextToText, BitsAndBytesConfig
from peft import PeftModel
import os
import random

MODEL_ID = "Qwen/Qwen3-VL-4B-Instruct"
ADAPTER_PATH = "./qwen3vl4b-satquery-lora-final/final"

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
        temperature=0.3,
        top_p=0.9,
        repetition_penalty=1.15,
    )
    full_text = processor.decode(output[0], skip_special_tokens=True)
    return full_text.split("assistant")[-1].strip()

def ask_two_images(image_path1, image_path2, question, max_new_tokens=150):
    img1 = Image.open(image_path1).convert("RGB")
    img2 = Image.open(image_path2).convert("RGB")
    messages = [
        {"role": "user", "content": [
            {"type": "image", "image": img1},
            {"type": "image", "image": img2},
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
        temperature=0.3,
        top_p=0.9,
        repetition_penalty=1.15,
    )
    full_text = processor.decode(output[0], skip_special_tokens=True)
    return full_text.split("assistant")[-1].strip()

# --- Interactive loop ---
all_images = os.listdir("dataset_images")

while True:
    mode = input("\n[1] Single image  [2] Two images  [quit]: ").strip()
    if mode.lower() == "quit":
        break

    if mode == "1":
        img = f"dataset_images/{random.choice(all_images)}"
        print(f"Using: {img}")
        question = input("Question: ").strip()
        print("\nAnswer:", ask(img, question))

    elif mode == "2":
        img1, img2 = random.sample(all_images, 2)
        img1 = f"dataset_images/{img1}"
        img2 = f"dataset_images/{img2}"
        print(f"Using: {img1} + {img2}")
        question = input("Question: ").strip()
        print("\nAnswer:", ask_two_images(img1, img2, question))