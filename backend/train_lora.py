import json
import torch
from datasets import Dataset
from PIL import Image
from transformers import AutoProcessor, AutoModelForImageTextToText, BitsAndBytesConfig
from trl import SFTTrainer, SFTConfig
from peft import LoraConfig

MODEL_ID = "Qwen/Qwen3-VL-4B-Instruct"

# --- 4-bit quantization config (fits 8GB VRAM) ---
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)

# --- Load model + processor ---
processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)
model = AutoModelForImageTextToText.from_pretrained(
    MODEL_ID,
    quantization_config=bnb_config,
    device_map={"": 0},
    dtype=torch.bfloat16,
    low_cpu_mem_usage=True,
    trust_remote_code=True,
)
model.gradient_checkpointing_enable()
model.config.use_cache = False

# --- LoRA config ---
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)

# --- THIS WAS MISSING: turns one jsonl row into Qwen3-VL's expected message format ---
def format_example(example):
    conv = example["conversation"]
    user_msg = conv[0]["content"]
    assistant_msg = conv[1]["content"]

    if "image" in example:
        # Single-image case (binary, mcq, captioning, bounding box)
        image = Image.open(example["image"]).convert("RGB")
        images = [image]
        content = [{"type": "image"}, {"type": "text", "text": user_msg}]

    elif "image_optical" in example:
        # Optical-SAR pair
        img_opt = Image.open(example["image_optical"]).convert("RGB")
        img_sar = Image.open(example["image_sar"]).convert("RGB")
        images = [img_opt, img_sar]
        content = [{"type": "image"}, {"type": "image"}, {"type": "text", "text": user_msg}]

    elif "image_t1" in example:
        # Bi-temporal change pair
        img_t1 = Image.open(example["image_t1"]).convert("RGB")
        img_t2 = Image.open(example["image_t2"]).convert("RGB")
        images = [img_t1, img_t2]
        content = [{"type": "image"}, {"type": "image"}, {"type": "text", "text": user_msg}]

    else:
        raise ValueError(f"Unrecognized example shape: {example.keys()}")

    messages = [
        {"role": "user", "content": content},
        {"role": "assistant", "content": [{"type": "text", "text": assistant_msg}]}
    ]
    return {"messages": messages, "images": images}

# --- Load train and validation sets separately ---
def load_jsonl(path):
    examples = []
    with open(path, "r") as f:
        for line in f:
            examples.append(json.loads(line))
    return examples

train_raw = load_jsonl("train_data.jsonl")
val_raw = load_jsonl("val_data.jsonl")

train_dataset = Dataset.from_list(train_raw)
val_dataset = Dataset.from_list(val_raw)

train_dataset = train_dataset.map(format_example, remove_columns=train_dataset.column_names)
val_dataset = val_dataset.map(format_example, remove_columns=val_dataset.column_names)

# --- Training settings ---
training_args = SFTConfig(
    output_dir="./qwen3vl4b-satquery-lora-v2",
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    num_train_epochs=3,
    learning_rate=2e-4,
    logging_steps=5,
    eval_strategy="epoch",
    per_device_eval_batch_size=1,
    bf16=True,
    fp16=False,
    save_strategy="epoch",
    report_to="none",
)

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    peft_config=lora_config,
)

trainer.train()
trainer.save_model("./qwen3vl4b-satquery-lora-v2/final")
print("Training complete. Adapter saved.")