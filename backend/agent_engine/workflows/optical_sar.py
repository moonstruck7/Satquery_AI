import os
from typing import List, Union
from agent_engine.model_interface import run_model

def build_optical_sar_prompt(query: str = "") -> str:
    """
    Constructs a joint Optical + SAR cross-modal analysis prompt template.
    """
    base_prompt = (
        "You are an expert remote-sensing AI vision assistant specializing in multimodal joint analysis. "
        "Image 1 is an Optical/Multispectral image and Image 2 is a Synthetic Aperture Radar (SAR) image of the same region. "
        "Jointly analyze both observations and leverage their complementary information—such as spectral reflectance from optical data "
        "and surface roughness, structural backscatter, or moisture characteristics from SAR data—to provide an integrated analysis of "
        "land cover, urban structures, water bodies, vegetation, and terrain features."
    )
    if query and query.strip():
        base_prompt += f"\n\nSpecific User Question/Focus: {query.strip()}"
    return base_prompt


def optical_sar_workflow(images: Union[List[str], str], query: str = "") -> str:
    """
    Optical + SAR Analysis workflow handler for SatQuery AI.

    Args:
        images: List containing exactly 2 image paths [optical_path, sar_path].
        query: Optional question or focus instruction.

    Returns:
        str: Textual joint multimodal analysis response returned by Qwen3-VL via model_interface.run_model().
    """
    # 1. Validate image count
    if not isinstance(images, list) or len(images) != 2:
        img_count = len(images) if isinstance(images, list) else (1 if isinstance(images, str) and images.strip() else 0)
        raise ValueError(f"Optical + SAR workflow requires exactly 2 images (Optical, SAR), but received {img_count}.")

    img_opt, img_sar = images[0], images[1]

    # 2. Check file existence for both optical and SAR images
    if not img_opt or not os.path.exists(img_opt):
        raise FileNotFoundError(f"Optical image file not found at path: {img_opt}")
    if not img_sar or not os.path.exists(img_sar):
        raise FileNotFoundError(f"SAR image file not found at path: {img_sar}")

    # 3. Construct prompt
    prompt = build_optical_sar_prompt(query)

    # 4. Delegate execution to model_interface.run_model([opt, sar], prompt)
    response = run_model(images=[img_opt, img_sar], prompt=prompt)
    return response
