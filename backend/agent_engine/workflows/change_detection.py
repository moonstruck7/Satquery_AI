import os
from typing import List, Union
from agent_engine.model_interface import run_model

def build_change_detection_prompt(query: str = "") -> str:
    """
    Constructs a bi-temporal remote-sensing change analysis prompt template.
    """
    base_prompt = (
        "You are an expert remote-sensing AI vision assistant specializing in bi-temporal change detection. "
        "Image 1 represents the earlier temporal observation (T1) and Image 2 represents the later temporal observation (T2). "
        "Compare both observations and provide a detailed textual analysis of visible changes in land cover, "
        "structures, roads, water bodies, vegetation, or urban development between T1 and T2."
    )
    if query and query.strip():
        base_prompt += f"\n\nSpecific User Question/Focus: {query.strip()}"
    return base_prompt


def change_detection_workflow(images: Union[List[str], str], query: str = "") -> str:
    """
    Bi-temporal Change Detection workflow handler for SatQuery AI.

    Args:
        images: List containing exactly 2 image paths [t1_path, t2_path].
        query: Optional question or focus instruction.

    Returns:
        str: Textual change analysis response returned by Qwen3-VL via model_interface.run_model().
    """
    # 1. Validate image count
    if not isinstance(images, list) or len(images) != 2:
        img_count = len(images) if isinstance(images, list) else (1 if isinstance(images, str) and images.strip() else 0)
        raise ValueError(f"Change Detection workflow requires exactly 2 images (T1, T2), but received {img_count}.")

    img_t1, img_t2 = images[0], images[1]

    # 2. Check image file existence for both T1 and T2
    if not img_t1 or not os.path.exists(img_t1):
        raise FileNotFoundError(f"First bi-temporal image (T1) not found at path: {img_t1}")
    if not img_t2 or not os.path.exists(img_t2):
        raise FileNotFoundError(f"Second bi-temporal image (T2) not found at path: {img_t2}")

    # 3. Construct prompt
    prompt = build_change_detection_prompt(query)

    # 4. Delegate execution to model_interface.run_model([t1, t2], prompt)
    response = run_model(images=[img_t1, img_t2], prompt=prompt)
    return response
