from huggingface_hub import list_repo_files

files = list_repo_files("GFM-Bench/BigEarthNet", repo_type="dataset")
print(files[:20])