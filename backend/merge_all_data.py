import json
import random

random.seed(42)

def load_jsonl(path):
    examples = []
    with open(path, "r") as f:
        for line in f:
            examples.append(json.loads(line))
    return examples

# Load your existing single-image set (binary/mcq/captioning/bounding box)
existing_train = load_jsonl("train_data.jsonl")
existing_val = load_jsonl("val_data.jsonl")

# Load the two new proxy sets
sar_examples = load_jsonl("sar_examples.jsonl")
change_examples = load_jsonl("change_examples.jsonl")

# Combine: keep existing train/val split as-is, split the NEW examples 90/10 the same way
def split_90_10(examples):
    random.shuffle(examples)
    cut = int(len(examples) * 0.9)
    return examples[:cut], examples[cut:]

sar_train, sar_val = split_90_10(sar_examples)
change_train, change_val = split_90_10(change_examples)

final_train = existing_train + sar_train + change_train
final_val = existing_val + sar_val + change_val

random.shuffle(final_train)
random.shuffle(final_val)

with open("train_data_full.jsonl", "w") as f:
    for ex in final_train:
        f.write(json.dumps(ex) + "\n")

with open("val_data_full.jsonl", "w") as f:
    for ex in final_val:
        f.write(json.dumps(ex) + "\n")

print(f"Final train: {len(final_train)}, Final val: {len(final_val)}")