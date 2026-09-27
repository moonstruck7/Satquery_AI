from datasets import load_dataset
import pandas as pd
import json
import os
import random

os.makedirs("dataset_images", exist_ok=True)
already_have = set(os.listdir("dataset_images"))
print(f"Already have {len(already_have)} images saved")

# Stream through and grab NEW images only, skipping ones you already saved
img_ds = load_dataset("timm/bigearthnet-v2-rgb", split="train", streaming=True)

target_new = 3000   # how many NEW images to add this round
collected_ids = []
count = 0

for sample in img_ds:
    img_id = sample['image_id']
    filename = f"{img_id}.png"
    if filename in already_have:
        continue
    sample['image'].save(f"dataset_images/{filename}")
    collected_ids.append(img_id)
    count += 1
    if count >= target_new:
        break

print(f"Saved {count} NEW images (total now: {len(already_have) + count})")