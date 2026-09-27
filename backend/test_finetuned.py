import torch
from transformers import AutoProcessor, AutoModelForImageTextToText, BitsAndBytesConfig
from peft import PeftModel

MODEL_ID = "Qwen/Qwen3-VL-4B-Instruct"
ADAPTER_PATH = "./qwen3vl4b-satquery-lora-v2/final"

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

# Load your fine-tuned adapter on top of the base model
model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)

# Test on one of your saved dataset images
from PIL import Image
image = Image.open("dataset_images/S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_89.png").convert("RGB")

messages = [
    {"role": "user", "content": [
        {"type": "image", "image": image},
        {"type": "text", "text": "Identify the location of the largest connected region of forest."}
    ]}
]

inputs = processor.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt", return_dict=True).to(model.device)
output = model.generate(**inputs, max_new_tokens=1000)
print(processor.decode(output[0], skip_special_tokens=True))