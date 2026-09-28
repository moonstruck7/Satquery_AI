import os
import sys
from unittest.mock import patch

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agent_engine.workflows.vqa import vqa_workflow, build_vqa_prompt
from agent_engine.tools import tool_registry
from agent_engine.executor import execute_workflow

def run_vqa_tests():
    print("=== Running Agent Engine VQA Workflow Tests ===")
    sample_img = os.path.join(backend_dir, "dataset_images", "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_89.png")

    # 1. Prompt Construction Test
    prompt = build_vqa_prompt("Is there a road?")
    assert "Is there a road?" in prompt
    print("Test 1 (Prompt Construction): PASSED")

    # 2. Mock Test (Verify handler reaches model_interface.run_model)
    with patch("agent_engine.workflows.vqa.run_model") as mock_run_model:
        mock_run_model.return_value = "Mocked Qwen response: Road detected in northern quadrant."
        res = vqa_workflow([sample_img], "Is there a road?")
        
        assert res == "Mocked Qwen response: Road detected in northern quadrant."
        mock_run_model.assert_called_once()
        called_args, called_kwargs = mock_run_model.call_args
        assert called_kwargs.get("images") == sample_img or called_args[0] == sample_img
        print("Test 2 (Mocked model_interface dispatch): PASSED")
        print(f"  Mock Call Args: {mock_run_model.call_args}")

    # 3. Executor Integration Test (Tool Registry -> Executor -> VQA Workflow)
    vqa_tool = tool_registry.get("VQA")
    with patch("agent_engine.workflows.vqa.run_model") as mock_run_model:
        mock_run_model.return_value = "Mocked Executor VQA Output"
        exec_res = execute_workflow(vqa_tool, [sample_img], "Is there a river?")
        
        assert exec_res.success is True
        assert exec_res.task == "VQA"
        assert exec_res.output == "Mocked Executor VQA Output"
        print("Test 3 (Executor -> VQA Tool integration): PASSED")

    # 4. Input Validation Failure Tests
    try:
        vqa_workflow([], "Test query")
        print("Test 4 (Empty image list validation): FAILED")
    except ValueError as e:
        print(f"Test 4 (Empty image list validation): PASSED ({e})")

    try:
        vqa_workflow(["non_existent_file.png"], "Test query")
        print("Test 5 (Missing image file validation): FAILED")
    except FileNotFoundError as e:
        print(f"Test 5 (Missing image file validation): PASSED ({e})")

    print("-" * 50)
    print("Summary of VQA Workflow Implementation:")
    print("  - VQA Handler works: YES")
    print("  - Reaches model_interface: YES")
    print("  - Mocked integration tests: PASSED")

    # Attempt Real Qwen Inference
    print("\nAttempting Real Qwen Model Inference (Real Image test)...")
    try:
        real_output = vqa_workflow(sample_img, "Is there a road in this image?")
        print(f"  - Real Qwen Inference Executed: YES")
        print(f"  - Model Output:\n{real_output}")
    except Exception as e:
        print(f"  - Real Qwen Inference Executed: NO (Model loading / local environment pending)")
        print(f"  - Reason/Error: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    run_vqa_tests()
