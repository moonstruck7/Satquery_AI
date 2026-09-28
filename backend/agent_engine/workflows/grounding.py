import os
from typing import List, Union
from agent_engine.model_interface import run_model

def build_grounding_prompt(query: str) -> str:
    """
    Constructs a spatial localization / text-guided grounding prompt.
    """
    return (
        "You are an expert remote-sensing AI vision assistant specializing in spatial grounding. "
        "Identify and describe the position, orientation, and spatial region of the requested target within the satellite image.\n\n"
        f"Target to Ground: {query}"
    )


def grounding_workflow(images: Union[str, List[str]], query: str) -> str:
    """
    Real Grounding workflow handler for SatQuery AI.

    Args:
        images: Single image file path (str) or list containing 1 image path (List[str]).
        query: Grounding query specifying target object or region to locate.

    Returns:
        str: Textual spatial localization response returned by Qwen3-VL via model_interface.run_model().
    """
    # 1. Validate image count
    if isinstance(images, list):
        if len(images) != 1:
            raise ValueError(f"Grounding workflow requires exactly 1 image, but received {len(images)}.")
        img_path = images[0]
    elif isinstance(images, str):
        img_path = images
    else:
        raise ValueError(f"Invalid image input type for Grounding workflow: {type(images).__name__}")

    # 2. Check image file existence
    if not img_path or not os.path.exists(img_path):
        raise FileNotFoundError(f"Grounding image file not found at path: {img_path}")

    # 3. Construct prompt
    prompt = build_grounding_prompt(query)

    # 4. Delegate execution to model_interface.run_model()
    response = run_model(images=img_path, prompt=prompt)
    return response
