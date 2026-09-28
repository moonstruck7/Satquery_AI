import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import agent_engine

def run_real_e2e_test():
    sample_img = os.path.join(backend_dir, "dataset_images", "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_40_89.png")
    query = "Is there vegetation or forest visible in this image?"

    print("=== Real End-to-End Agent Engine Pipeline Test ===")
    print(f"Image Used: {sample_img}")
    print(f"User Query: \"{query}\"")
    print("-" * 50)

    # Invokes full un-mocked pipeline: Query -> Classifier -> Router -> Executor -> VQA Workflow -> Model Interface -> Qwen3-VL
    result = agent_engine.run_agent(query=query, images=[sample_img])

    print("\n--- ExecutionResult Summary ---")
    print(f"Classified Task / Executed Tool: {result.task}")
    print(f"Workflow Success Status:          {result.success}")
    print(f"Error (if any):                  {result.error}")
    print(f"\nActual Qwen Response:\n{result.output}")
    print("-" * 50)

if __name__ == "__main__":
    run_real_e2e_test()
