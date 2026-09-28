import os
import sys
from typing import Union, List

def run_model(images: Union[str, List[str]], prompt: str) -> str:
    """
    Thin wrapper delegating inference directly to interactive_test.py functions.
    Lazy imports interactive_test so importing agent_engine doesn't trigger model loading.
    
    Args:
        images: Single image file path (str) or list of image file paths (List[str]).
        prompt: Question or user query string.
        
    Returns:
        str: Result from Qwen3-VL inference.
    """
    # Ensure backend root directory is in sys.path
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    import interactive_test

    if isinstance(images, list):
        if len(images) == 1:
            return interactive_test.ask(images[0], prompt)
        elif len(images) == 2:
            return interactive_test.ask_two_images(images[0], images[1], prompt)
        else:
            raise ValueError(f"Unsupported image count ({len(images)}). Expected 1 or 2 images.")
    else:
        return interactive_test.ask(images, prompt)
