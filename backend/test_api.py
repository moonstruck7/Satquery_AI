import os
import random
import requests

url = "http://127.0.0.1:8000/query"
all_images = os.listdir("dataset_images")

# --- Single-image test ---
img = random.choice(all_images)
with open(f"dataset_images/{img}", "rb") as f:
    r = requests.post(
        url,
        data={"question": "What is the dominant land cover in this image?"},
        files=[("images", (img, f, "image/png"))],
    )
print("Single-image status:", r.status_code)
print(r.json())

# --- Two-image test ---
img1, img2 = random.sample(all_images, 2)
with open(f"dataset_images/{img1}", "rb") as f1, open(f"dataset_images/{img2}", "rb") as f2:
    r = requests.post(
        url,
        data={"question": "Compare these two satellite images and describe the differences in land cover."},
        files=[
            ("images", (img1, f1, "image/png")),
            ("images", (img2, f2, "image/png")),
        ],
    )
print("\nTwo-image status:", r.status_code)
print(r.json())