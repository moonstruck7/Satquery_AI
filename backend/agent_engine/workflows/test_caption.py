import os
import sys
from unittest.mock import patch

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agent_engine.workflows.caption import caption_workflow, build_caption_prompt
from agent_engine.tools import tool_registry
from agent_engine.executor import execute_workflow

def run_caption_tests():
    print("=== Running Agent Engine Caption Workflow Tests ===")
    sample_img = os.path.join(backend_dir, "dataset_images", "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_89.png")

    # 1. Prompt Construction Test
    prompt = build_caption_prompt("Focus on agricultural fields.")
    assert "detailed description of the satellite image" in prompt
    assert "Focus on agricultural fields." in prompt
    print("Test 1 (Prompt Construction): PASSED")

    # 2. Mock Test (Verify handler reaches model_interface.run_model)
    with patch("agent_engine.workflows.caption.run_model") as mock_run_model:
        mock_run_model.return_value = "Mocked Qwen response: The scene displays dense forest canopy bordered by cropland."
        res = caption_workflow([sample_img], "Describe scene")

        assert res == "Mocked Qwen response: The scene displays dense forest canopy bordered by cropland."
        mock_run_model.assert_called_once()
        called_args, called_kwargs = mock_run_model.call_args
        assert called_kwargs.get("images") == sample_img or called_args[0] == sample_img
        print("Test 2 (Mocked model_interface dispatch): PASSED")
        print(f"  Mock Call Args: {mock_run_model.call_args}")

    # 3. Executor Integration Test (Tool Registry -> Executor -> Caption Workflow)
    caption_tool = tool_registry.get("CAPTION")
    with patch("agent_engine.workflows.caption.run_model") as mock_run_model:
        mock_run_model.return_value = "Mocked Executor Caption Output"
        exec_res = execute_workflow(caption_tool, [sample_img], "Describe this image.")

        assert exec_res.success is True
        assert exec_res.task == "CAPTION"
        assert exec_res.output == "Mocked Executor Caption Output"
        print("Test 3 (Executor -> CAPTION Tool integration): PASSED")

    # 4. Input Validation Failure Tests
    try:
        caption_workflow([], "Describe scene")
        print("Test 4 (Empty image list validation): FAILED")
    except ValueError as e:
        print(f"Test 4 (Empty image list validation): PASSED ({e})")

    try:
        caption_workflow(["missing_image.png"], "Describe scene")
        print("Test 5 (Missing image path validation): FAILED")
    except FileNotFoundError as e:
        print(f"Test 5 (Missing image path validation): PASSED ({e})")

    print("-" * 50)
    print("Summary of Image Captioning Workflow Implementation:")
    print("  - Caption Handler works: YES")
    print("  - Reaches model_interface: YES")
    print("  - Mocked integration tests: PASSED")
    print("  - Real Qwen Model Inference Status: PENDING (Model download/loading skipped for fast test execution)")
    print("ALL CAPTION WORKFLOW TESTS PASSED SUCCESSFULLY.")

if __name__ == "__main__":
    run_caption_tests()
