import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agent_engine.model_interface import run_model

def test_single_image():
    sample_img = os.path.join("dataset_images", "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_89.png")
    prompt = "Describe the main land cover in this image."
    print(f"Testing run_model on image: {sample_img}")
    print(f"Prompt: {prompt}")
    
    result = run_model(sample_img, prompt)
    print("\n--- Inference Result ---")
    print(result)
    print("------------------------")

if __name__ == "__main__":
    test_single_image()
