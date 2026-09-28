import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agent_engine.classifier import ClassificationResult
from agent_engine.router import route_task, RoutingError

def run_router_tests():
    print("=== Running Agent Engine Router & Tool Registry Tests ===")
    
    test_cases = [
        {
            "task": "VQA",
            "reason": "VQA test query",
            "expected_tool_name": "VQA",
            "should_error": False
        },
        {
            "task": "CAPTION",
            "reason": "Caption test query",
            "expected_tool_name": "CAPTION",
            "should_error": False
        },
        {
            "task": "GROUNDING",
            "reason": "Grounding test query",
            "expected_tool_name": "GROUNDING",
            "should_error": False
        },
        {
            "task": "CHANGE_DETECTION",
            "reason": "Change detection test query",
            "expected_tool_name": "CHANGE_DETECTION",
            "should_error": False
        },
        {
            "task": "OPTICAL_SAR",
            "reason": "Optical+SAR test query",
            "expected_tool_name": "OPTICAL_SAR",
            "should_error": False
        },
        {
            "task": "UNKNOWN",
            "reason": "Unrecognized request",
            "expected_tool_name": None,
            "should_error": True
        }
    ]

    all_passed = True

    for i, test in enumerate(test_cases, 1):
        task_name = test["task"]
        reason = test["reason"]
        expected_name = test["expected_tool_name"]
        should_error = test["should_error"]

        classification = ClassificationResult(
            task=task_name,
            confidence=0.9 if task_name != "UNKNOWN" else 0.0,
            reason=reason
        )

        if should_error:
            try:
                tool = route_task(classification)
                print(f"Test {i}: FAILED (Expected RoutingError for UNKNOWN, but got tool '{tool.name}')")
                all_passed = False
            except RoutingError as e:
                print(f"Test {i}: PASSED (Controlled RoutingError received as expected: {e})")
        else:
            try:
                tool = route_task(classification)
                if tool.name == expected_name:
                    print(f"Test {i}: PASSED (Task '{task_name}' -> Tool '{tool.name}')")
                    print(f"  Description: {tool.description}")
                    print(f"  Required Images: {tool.required_image_count}")
                else:
                    print(f"Test {i}: FAILED (Expected '{expected_name}', got '{tool.name}')")
                    all_passed = False
            except RoutingError as e:
                print(f"Test {i}: FAILED (Unexpected RoutingError for '{task_name}': {e})")
                all_passed = False
        print("-" * 50)

    if all_passed:
        print("ALL ROUTER TESTS PASSED SUCCESSFULLY.")
    else:
        print("SOME ROUTER TESTS FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    run_router_tests()
