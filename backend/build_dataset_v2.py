from datasets import load_dataset
import pandas as pd
import json
import random

random.seed(42)  # reproducible split

# Load your saved image IDs
import os
saved_images = set(f.replace(".png", "") for f in os.listdir("dataset_images"))
print(f"Total images available: {len(saved_images)}")

# Load text data, keep only rows matching images you have
df = pd.read_parquet("BigEarthNet.txt/BigEarthNet.txt.parquet")
df_matched = df[df['patch_id'].isin(saved_images)]
print(f"Matched text rows: {len(df_matched)}")
print(df_matched['type'].value_counts())

# Pick a larger, balanced quota per type
QUOTA_PER_TYPE = 120
examples = []

for task_type, group in df_matched.groupby('type'):
    picked = group.sample(n=min(QUOTA_PER_TYPE, len(group)), random_state=42)
    for _, row in picked.iterrows():
        examples.append({
            "image": f"dataset_images/{row['patch_id']}.png",
            "conversation": [
                {"role": "user", "content": row['input']},
                {"role": "assistant", "content": row['output']}
            ],
            "type": row['type']  # keep this for reference, we'll strip it before training
        })

print(f"\nTotal examples assembled: {len(examples)}")

# Shuffle, then split 90/10
random.shuffle(examples)
split_point = int(len(examples) * 0.9)
train_examples = examples[:split_point]
val_examples = examples[split_point:]

print(f"Train: {len(train_examples)}, Validation: {len(val_examples)}")

with open("train_data.jsonl", "w") as f:
    for ex in train_examples:
        f.write(json.dumps(ex) + "\n")

with open("val_data.jsonl", "w") as f:
    for ex in val_examples:
        f.write(json.dumps(ex) + "\n")

print("Saved train_data.jsonl and val_data.jsonl")