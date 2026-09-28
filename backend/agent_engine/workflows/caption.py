import os
from typing import List, Union
from agent_engine.model_interface import run_model

def build_caption_prompt(query: str = "") -> str:
    """
    Constructs a detailed remote-sensing scene description prompt template.
    """
    base_prompt = (
        "You are an expert remote-sensing AI vision assistant. "
        "Provide a detailed description of the satellite image, including land cover types, "
        "major terrain/water features, human structures, and overall scene layout."
    )
    if query and query.strip():
        base_prompt += f"\n\nSpecific Focus: {query.strip()}"
    return base_prompt


def caption_workflow(images: Union[str, List[str]], query: str = "") -> str:
    """
    Real Image Captioning / Scene Description workflow handler for SatQuery AI.

    Args:
        images: Single image file path (str) or list containing 1 image path (List[str]).
        query: Optional user prompt or specific area of interest.

    Returns:
        str: Scene description returned by Qwen3-VL model via model_interface.run_model().
    """
    # 1. Validate image count
    if isinstance(images, list):
        if len(images) != 1:
            raise ValueError(f"Caption workflow requires exactly 1 image, but received {len(images)}.")
        img_path = images[0]
    elif isinstance(images, str):
        img_path = images
    else:
        raise ValueError(f"Invalid image input type for Caption workflow: {type(images).__name__}")

    # 2. Check image file existence
    if not img_path or not os.path.exists(img_path):
        raise FileNotFoundError(f"Caption image file not found at path: {img_path}")

    # 3. Construct prompt
    prompt = build_caption_prompt(query)

    # 4. Delegate execution to model_interface.run_model()
    response = run_model(images=img_path, prompt=prompt)
    return response
