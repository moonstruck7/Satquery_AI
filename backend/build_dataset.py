from datasets import load_dataset
import pandas as pd
import json
import os

os.makedirs("dataset_images", exist_ok=True)

# Step 1: Grab a batch of images (500 is plenty to find good matches across task types)
img_ds = load_dataset("timm/bigearthnet-v2-rgb", split="train", streaming=True)

collected_ids = []
for i, sample in enumerate(img_ds):
    if i >= 500:
        break
    img_id = sample['image_id']
    sample['image'].save(f"dataset_images/{img_id}.png")
    collected_ids.append(img_id)

print(f"Saved {len(collected_ids)} images")

# Step 2: Load your text data, keep only rows matching the images we just saved
df = pd.read_parquet("BigEarthNet.txt/BigEarthNet.txt.parquet")
df_matched = df[df['patch_id'].isin(collected_ids)]
print(f"Matched {len(df_matched)} text rows to your saved images")
print(df_matched['type'].value_counts())   # see how many of each task type you got

# Step 3: Pick a manageable number per task type (adjust numbers if a type has too few/many)
examples = []
for task_type, group in df_matched.groupby('type'):
    picked = group.head(15)   # up to 15 examples per type
    for _, row in picked.iterrows():
        examples.append({
            "image": f"dataset_images/{row['patch_id']}.png",
            "conversation": [
                {"role": "user", "content": row['input']},
                {"role": "assistant", "content": row['output']}
            ]
        })

# Step 4: Save your final combined training file
with open("train_data.jsonl", "w") as f:
    for ex in examples:
        f.write(json.dumps(ex) + "\n")

print(f"Final dataset: {len(examples)} examples written to train_data.jsonl")