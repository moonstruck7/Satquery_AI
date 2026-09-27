import os
import torch
import random
from PIL import Image
from transformers import AutoProcessor, AutoModelForImageTextToText, BitsAndBytesConfig
from peft import PeftModel

MODEL_ID = "Qwen/Qwen3-VL-4B-Instruct"
ADAPTER_PATH = "./qwen3vl-satquery-lora/final"

# --- Automatically grab the first two images from your dataset folder ---
all_images = os.listdir("dataset_images")
image_files = random.sample(all_images, 2)
print("Using images:", image_files)

img1 = Image.open(f"dataset_images/{image_files[0]}").convert("RGB")
img2 = Image.open(f"dataset_images/{image_files[1]}").convert("RGB")

# --- Load model + adapter (same as before) ---
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)

processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)
base_model = AutoModelForImageTextToText.from_pretrained(
    MODEL_ID,
    quantization_config=bnb_config,
    device_map={"": 0},
    dtype=torch.bfloat16,
    trust_remote_code=True,
)
model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)

# --- Two-image message ---
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image", "image": img1},
            {"type": "image", "image": img2},
            {"type": "text", "text": "Compare these two satellite images and describe any differences you notice."}
        ]
    }
]

inputs = processor.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True, return_tensors="pt", return_dict=True
).to(model.device)

print("Generating...")
output = model.generate(**inputs, max_new_tokens=1000)
print(processor.decode(output[0], skip_special_tokens=True))