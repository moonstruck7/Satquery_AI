import os
import json
import random
from PIL import Image, ImageFilter
import pandas as pd

random.seed(42)
os.makedirs("proxy_sar_images", exist_ok=True)

df = pd.read_parquet("BigEarthNet.txt/BigEarthNet.txt.parquet")
saved_images = os.listdir("dataset_images")

# ============================================================
# PART 1: Optical-SAR proxy examples
# ============================================================
# Take a handful of images, create a grayscale/edge-filtered "SAR-like" version
sar_examples = []
sample_files = random.sample(saved_images, min(80, len(saved_images)))

for fname in sample_files:
    patch_id = fname.replace(".png", "")
    optical_path = f"dataset_images/{fname}"

    # Create the SAR-like proxy: grayscale + edge enhancement (mimics SAR's texture-heavy look)
    img = Image.open(optical_path).convert("L")  # grayscale
    img_sar_like = img.filter(ImageFilter.FIND_EDGES)
    sar_path = f"proxy_sar_images/{patch_id}_sarlike.png"
    img_sar_like.save(sar_path)

    # Find a real caption/label for this patch to use as the answer basis
    matches = df[(df['patch_id'] == patch_id) & (df['type'] == 'captioning')]
    if len(matches) == 0:
        continue
    caption = matches.iloc[0]['output']

    sar_examples.append({
        "image_optical": optical_path,
        "image_sar": sar_path,
        "conversation": [
            {"role": "user", "content": "Using the optical and SAR images together, describe the dominant land cover and features visible."},
            {"role": "assistant", "content": caption}
        ],
        "type": "optical_sar"
    })

print(f"Built {len(sar_examples)} optical-SAR proxy examples")

# ============================================================
# PART 2: Change-analysis proxy examples (adjacent patches)
# ============================================================
change_examples = []
used = set()

for _ in range(80):
    pair = random.sample(saved_images, 2)
    if tuple(sorted(pair)) in used:
        continue
    used.add(tuple(sorted(pair)))

    id1 = pair[0].replace(".png", "")
    id2 = pair[1].replace(".png", "")

    cap1 = df[(df['patch_id'] == id1) & (df['type'] == 'captioning')]
    cap2 = df[(df['patch_id'] == id2) & (df['type'] == 'captioning')]
    if len(cap1) == 0 or len(cap2) == 0:
        continue

    answer = f"The first image shows {cap1.iloc[0]['output'].lower()} The second image shows {cap2.iloc[0]['output'].lower()} The main difference is the change in land cover composition between the two areas."

    change_examples.append({
        "image_t1": f"dataset_images/{pair[0]}",
        "image_t2": f"dataset_images/{pair[1]}",
        "conversation": [
            {"role": "user", "content": "Compare these two satellite images and describe the differences in land cover."},
            {"role": "assistant", "content": answer}
        ],
        "type": "change"
    })

print(f"Built {len(change_examples)} change-analysis proxy examples")

# ============================================================
# Save both as separate files for now
# ============================================================
with open("sar_examples.jsonl", "w") as f:
    for ex in sar_examples:
        f.write(json.dumps(ex) + "\n")

with open("change_examples.jsonl", "w") as f:
    for ex in change_examples:
        f.write(json.dumps(ex) + "\n")

print("Saved sar_examples.jsonl and change_examples.jsonl")