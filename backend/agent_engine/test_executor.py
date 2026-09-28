import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agent_engine.tools import Tool, tool_registry
from agent_engine.executor import execute_workflow, ExecutionResult

def failing_handler(images, query):
    raise RuntimeError("Simulated workflow failure in test.")

def run_executor_tests():
    print("=== Running Agent Engine Executor Tests ===")
    all_passed = True

    # 1. Test Correct Image Count
    vqa_tool = tool_registry.get("VQA")
    res1 = execute_workflow(tool=vqa_tool, images=["img1.png"], query="Is there a road?")
    if res1.success and res1.task == "VQA" and res1.output == "VQA Workflow Placeholder Response":
        print("Test 1 (Correct Image Count - VQA): PASSED")
    else:
        print(f"Test 1 FAILED: {res1}")
        all_passed = False

    change_tool = tool_registry.get("CHANGE_DETECTION")
    res2 = execute_workflow(tool=change_tool, images=["t1.png", "t2.png"], query="What changed?")
    if res2.success and res2.task == "CHANGE_DETECTION":
        print("Test 2 (Correct Image Count - CHANGE_DETECTION): PASSED")
    else:
        print(f"Test 2 FAILED: {res2}")
        all_passed = False

    # 2. Test Incorrect Image Count
    res3 = execute_workflow(tool=change_tool, images=["single_img.png"], query="What changed?")
    if not res3.success and "Image count mismatch" in (res3.error or ""):
        print(f"Test 3 (Incorrect Image Count handling): PASSED (Controlled error: {res3.error})")
    else:
        print(f"Test 3 FAILED: {res3}")
        all_passed = False

    res4 = execute_workflow(tool=vqa_tool, images=["img1.png", "img2.png"], query="Is there a road?")
    if not res4.success and "Image count mismatch" in (res4.error or ""):
        print(f"Test 4 (Extra images for single-image tool): PASSED (Controlled error: {res4.error})")
    else:
        print(f"Test 4 FAILED: {res4}")
        all_passed = False

    # 3. Test Unsupported / Invalid Tool
    res5 = execute_workflow(tool="NOT_A_TOOL_OBJECT", images=["img.png"], query="Test")
    if not res5.success and "Invalid tool object" in (res5.error or ""):
        print(f"Test 5 (Invalid Tool Object handling): PASSED (Controlled error: {res5.error})")
    else:
        print(f"Test 5 FAILED: {res5}")
        all_passed = False

    # 4. Test Handler Execution Failure
    buggy_tool = Tool(
        name="BUGGY_WORKFLOW",
        description="Test tool that raises exception",
        required_image_count=1,
        handler=failing_handler
    )
    res6 = execute_workflow(tool=buggy_tool, images=["img.png"], query="Test")
    if not res6.success and "Simulated workflow failure" in (res6.error or ""):
        print(f"Test 6 (Handler Execution Failure handling): PASSED (Controlled error: {res6.error})")
    else:
        print(f"Test 6 FAILED: {res6}")
        all_passed = False

    print("-" * 50)
    if all_passed:
        print("ALL EXECUTOR TESTS PASSED SUCCESSFULLY.")
    else:
        print("SOME EXECUTOR TESTS FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    run_executor_tests()
