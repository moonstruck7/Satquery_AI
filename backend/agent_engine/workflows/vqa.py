import os
from typing import List, Union
from agent_engine.model_interface import run_model

def build_vqa_prompt(query: str) -> str:
    """
    Constructs a clear remote-sensing VQA prompt template.
    """
    return f"You are an expert remote-sensing AI vision assistant. Analyze the provided satellite image and answer the following question accurately:\n\nQuestion: {query}"


def vqa_workflow(images: Union[str, List[str]], query: str) -> str:
    """
    Real VQA workflow handler for SatQuery AI.

    Args:
        images: Single image file path (str) or list containing 1 image path (List[str]).
        query: User question string regarding the satellite image.

    Returns:
        str: Answer returned by Qwen3-VL through model_interface.run_model().
    """
    # 1. Validate image count
    if isinstance(images, list):
        if len(images) != 1:
            raise ValueError(f"VQA workflow requires exactly 1 image, but received {len(images)}.")
        img_path = images[0]
    elif isinstance(images, str):
        img_path = images
    else:
        raise ValueError(f"Invalid image input type for VQA: {type(images).__name__}")

    # 2. Check image file existence
    if not img_path or not os.path.exists(img_path):
        raise FileNotFoundError(f"VQA image file not found at path: {img_path}")

    # 3. Construct prompt
    prompt = build_vqa_prompt(query)

    # 4. Delegate execution to model_interface.run_model()
    response = run_model(images=img_path, prompt=prompt)
    return response
