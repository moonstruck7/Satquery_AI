import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agent_engine.classifier import classify_query

def run_classifier_tests():
    test_cases = [
        {
            "query": "Is there a road in this image?",
            "num_images": 1,
            "expected_task": "VQA"
        },
        {
            "query": "Describe this satellite image.",
            "num_images": 1,
            "expected_task": "CAPTION"
        },
        {
            "query": "Where is the water body?",
            "num_images": 1,
            "expected_task": "GROUNDING"
        },
        {
            "query": "What changed between these two images?",
            "num_images": 2,
            "expected_task": "CHANGE_DETECTION"
        },
        {
            "query": "Compare the optical and SAR images.",
            "num_images": 2,
            "modalities": ["optical", "sar"],
            "expected_task": "OPTICAL_SAR"
        },
        {
            "query": "Write a python script to sort a list of numbers.",
            "num_images": 0,
            "expected_task": "UNKNOWN"
        }
    ]

    print("=== Running Agent Engine Classifier Tests ===")
    all_passed = True

    for i, test in enumerate(test_cases, 1):
        query = test["query"]
        num_images = test.get("num_images", 1)
        modalities = test.get("modalities", None)
        expected = test["expected_task"]

        result = classify_query(query, num_images=num_images, modalities=modalities)
        status = "PASSED" if result.task == expected else "FAILED"
        if result.task != expected:
            all_passed = False

        print(f"Test {i}: {status}")
        print(f"  Query:      \"{query}\"")
        print(f"  Expected:   {expected}")
        print(f"  Got:        {result.task} (confidence={result.confidence})")
        print(f"  Reason:     {result.reason}")
        print("-" * 50)

    if all_passed:
        print("ALL CLASSIFIER TESTS PASSED SUCCESSFULLY.")
    else:
        print("SOME CLASSIFIER TESTS FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    run_classifier_tests()
