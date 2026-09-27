from datasets import load_dataset

ds = load_dataset("GFM-Bench/BigEarthNet", split="train", streaming=True)
sample = next(iter(ds))
print(sample.keys())
print(sample)