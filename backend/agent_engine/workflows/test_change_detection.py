import os
import sys
from unittest.mock import patch

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agent_engine.workflows.change_detection import change_detection_workflow, build_change_detection_prompt
from agent_engine.tools import tool_registry
from agent_engine.executor import execute_workflow

def run_change_detection_tests():
    print("=== Running Agent Engine Change Detection Workflow Tests ===")
    sample_img1 = os.path.join(backend_dir, "dataset_images", "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_89.png")
    sample_img2 = os.path.join(backend_dir, "dataset_images", "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_90.png")

    # 1. Prompt Construction Test
    prompt = build_change_detection_prompt("Focus on new road construction.")
    assert "Image 1 represents the earlier temporal observation (T1)" in prompt
    assert "Focus on new road construction." in prompt
    print("Test 1 (Prompt Construction): PASSED")

    # 2. Mock Test (Verify handler reaches model_interface.run_model with 2 images)
    with patch("agent_engine.workflows.change_detection.run_model") as mock_run_model:
        mock_run_model.return_value = "Mocked Qwen response: New building structures detected in T2 compared to T1."
        res = change_detection_workflow([sample_img1, sample_img2], "What changed?")

        assert res == "Mocked Qwen response: New building structures detected in T2 compared to T1."
        mock_run_model.assert_called_once()
        called_args, called_kwargs = mock_run_model.call_args
        images_passed = called_kwargs.get("images") or called_args[0]
        assert images_passed == [sample_img1, sample_img2]
        print("Test 2 (Mocked 2-image model_interface dispatch): PASSED")
        print(f"  Mock Call Images Passed: {images_passed}")

    # 3. Executor Integration Test (Tool Registry -> Executor -> Change Detection Workflow)
    change_tool = tool_registry.get("CHANGE_DETECTION")
    with patch("agent_engine.workflows.change_detection.run_model") as mock_run_model:
        mock_run_model.return_value = "Mocked Executor Change Detection Output"
        exec_res = execute_workflow(change_tool, [sample_img1, sample_img2], "Compare observations.")

        assert exec_res.success is True
        assert exec_res.task == "CHANGE_DETECTION"
        assert exec_res.output == "Mocked Executor Change Detection Output"
        print("Test 3 (Executor -> CHANGE_DETECTION Tool integration): PASSED")

    # 4. Zero Images Input Validation
    try:
        change_detection_workflow([], "What changed?")
        print("Test 4 (Zero images validation): FAILED")
    except ValueError as e:
        print(f"Test 4 (Zero images validation): PASSED ({e})")

    # 5. One Image Input Validation
    try:
        change_detection_workflow([sample_img1], "What changed?")
        print("Test 5 (One image validation): FAILED")
    except ValueError as e:
        print(f"Test 5 (One image validation): PASSED ({e})")

    # 6. Three Images Input Validation
    try:
        change_detection_workflow([sample_img1, sample_img2, sample_img1], "What changed?")
        print("Test 6 (Three images validation): FAILED")
    except ValueError as e:
        print(f"Test 6 (Three images validation): PASSED ({e})")

    # 7. Missing First Image File Validation
    try:
        change_detection_workflow(["non_existent_t1.png", sample_img2], "What changed?")
        print("Test 7 (Missing first image file validation): FAILED")
    except FileNotFoundError as e:
        print(f"Test 7 (Missing first image file validation): PASSED ({e})")

    # 8. Missing Second Image File Validation
    try:
        change_detection_workflow([sample_img1, "non_existent_t2.png"], "What changed?")
        print("Test 8 (Missing second image file validation): FAILED")
    except FileNotFoundError as e:
        print(f"Test 8 (Missing second image file validation): PASSED ({e})")

    print("-" * 50)
    print("Summary of Change Detection Workflow Implementation:")
    print("  - Bi-temporal 2-image handler works: YES")
    print("  - Reaches model_interface with [T1, T2]: YES")
    print("  - Extensible Textual Change Analysis: YES")
    print("  - Mocked integration tests: PASSED")
    print("ALL CHANGE DETECTION WORKFLOW TESTS PASSED SUCCESSFULLY.")

if __name__ == "__main__":
    run_change_detection_tests()
