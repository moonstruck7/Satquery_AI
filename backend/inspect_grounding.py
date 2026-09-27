import pandas as pd

df = pd.read_parquet("BigEarthNet.txt/BigEarthNet.txt.parquet")
grounding_rows = df[df['type'] == 'bounding box']

print(f"Total grounding examples in full dataset: {len(grounding_rows)}")
print("\n--- Sample examples ---\n")

for i, row in grounding_rows.head(5).iterrows():
    print("INPUT: ", row['input'])
    print("OUTPUT:", row['output'])
    print("CATEGORY:", row['category'])
    print("-" * 60)