import os
import sys
from unittest.mock import patch

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agent_engine.engine import run_agent

def run_engine_tests():
    print("=== Running Agent Engine Controller Tests ===")
    sample_img1 = os.path.join(backend_dir, "dataset_images", "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_89.png")
    sample_img2 = os.path.join(backend_dir, "dataset_images", "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_90.png")

    all_passed = True

    # 1. VQA Query Test
    with patch("agent_engine.workflows.vqa.run_model") as mock_run:
        mock_run.return_value = "Engine Test: Road detected."
        res1 = run_agent("Is there a road in this image?", [sample_img1])
        if res1.success and res1.task == "VQA" and res1.output == "Engine Test: Road detected.":
            print("Test 1 (VQA Query -> VQA Tool -> Executor): PASSED")
        else:
            print(f"Test 1 FAILED: {res1}")
            all_passed = False

    # 2. Caption Query Test
    with patch("agent_engine.workflows.caption.run_model") as mock_run:
        mock_run.return_value = "Engine Test: Scene description output."
        res2 = run_agent("Describe this satellite image.", [sample_img1])
        if res2.success and res2.task == "CAPTION" and res2.output == "Engine Test: Scene description output.":
            print("Test 2 (Caption Query -> CAPTION Tool -> Executor): PASSED")
        else:
            print(f"Test 2 FAILED: {res2}")
            all_passed = False

    # 3. Grounding Query Test
    with patch("agent_engine.workflows.grounding.run_model") as mock_run:
        mock_run.return_value = "Engine Test: Water body located in east region."
        res3 = run_agent("Where is the water body?", [sample_img1])
        if res3.success and res3.task == "GROUNDING" and res3.output == "Engine Test: Water body located in east region.":
            print("Test 3 (Grounding Query -> GROUNDING Tool -> Executor): PASSED")
        else:
            print(f"Test 3 FAILED: {res3}")
            all_passed = False

    # 4. Change Detection Query Test
    with patch("agent_engine.workflows.change_detection.run_model") as mock_run:
        mock_run.return_value = "Engine Test: Buildings added in T2."
        res4 = run_agent("What changed between these two images?", [sample_img1, sample_img2])
        if res4.success and res4.task == "CHANGE_DETECTION" and res4.output == "Engine Test: Buildings added in T2.":
            print("Test 4 (Change Query -> CHANGE_DETECTION Tool -> Executor): PASSED")
        else:
            print(f"Test 4 FAILED: {res4}")
            all_passed = False

    # 5. Optical + SAR Query Test
    with patch("agent_engine.workflows.optical_sar.run_model") as mock_run:
        mock_run.return_value = "Engine Test: Joint Optical+SAR output."
        res5 = run_agent("Compare the optical and SAR images.", [sample_img1, sample_img2], modalities=["optical", "sar"])
        if res5.success and res5.task == "OPTICAL_SAR" and res5.output == "Engine Test: Joint Optical+SAR output.":
            print("Test 5 (Optical/SAR Query -> OPTICAL_SAR Tool -> Executor): PASSED")
        else:
            print(f"Test 5 FAILED: {res5}")
            all_passed = False

    # 6. UNKNOWN Query Test
    res6 = run_agent("Write a python script to reverse a string.", [sample_img1])
    if not res6.success and res6.task == "UNKNOWN" and "task is UNKNOWN" in (res6.error or ""):
        print(f"Test 6 (UNKNOWN Query -> Controlled Routing Failure): PASSED (Clean error: {res6.error})")
    else:
        print(f"Test 6 FAILED: {res6}")
        all_passed = False

    print("-" * 50)
    if all_passed:
        print("ALL CONTROLLER (engine.py) TESTS PASSED SUCCESSFULLY.")
    else:
        print("SOME CONTROLLER TESTS FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    run_engine_tests()
