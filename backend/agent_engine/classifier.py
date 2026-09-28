from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict

# Allowed constrained tasks as per spec
SUPPORTED_TASKS = {
    "VQA",
    "CAPTION",
    "GROUNDING",
    "CHANGE_DETECTION",
    "OPTICAL_SAR",
    "UNKNOWN"
}

@dataclass
class ClassificationResult:
    task: str
    confidence: float
    reason: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def classify_query(
    query: str,
    num_images: int = 1,
    modalities: Optional[List[str]] = None
) -> ClassificationResult:
    """
    Deterministic rule-based query classifier for SatQuery AI.

    Args:
        query: User natural language input string.
        num_images: Number of input images provided (default 1).
        modalities: Optional list of image modalities (e.g. ["optical", "sar"]).

    Returns:
        ClassificationResult containing task name, confidence, and reasoning.
    """
    if not query or not query.strip():
        return ClassificationResult(
            task="UNKNOWN",
            confidence=0.0,
            reason="Empty query provided."
        )

    q_clean = query.strip().lower()

    # Normalize modalities
    norm_modalities = [m.lower() for m in (modalities or [])]
    has_sar = "sar" in norm_modalities or "radar" in norm_modalities or "sar" in q_clean or "radar" in q_clean

    # 1. OPTICAL + SAR Analysis check
    if has_sar or "optical and sar" in q_clean or "sar image" in q_clean:
        return ClassificationResult(
            task="OPTICAL_SAR",
            confidence=0.95,
            reason="Query or image metadata explicitly specifies SAR/optical multimodal analysis."
        )

    # 2. Bi-temporal Change Detection check
    change_keywords = ["change", "changed", "difference", "between these", "before and after", "temporal"]
    if num_images == 2 or any(kw in q_clean for kw in change_keywords):
        if any(kw in q_clean for kw in change_keywords) or num_images == 2:
            return ClassificationResult(
                task="CHANGE_DETECTION",
                confidence=0.95,
                reason="Query/images indicate bi-temporal change analysis across images."
            )

    # 3. Grounding / Localization check
    grounding_keywords = ["where is", "locate", "location of", "find the", "bounding box", "show region", "highlight"]
    if any(kw in q_clean for kw in grounding_keywords):
        return ClassificationResult(
            task="GROUNDING",
            confidence=0.90,
            reason="Query requests object/region localization or spatial grounding."
        )

    # 4. Image Captioning / Scene Description check
    caption_keywords = ["describe", "description", "overview", "summarize", "caption", "what is shown in the scene", "scene description"]
    if any(kw in q_clean for kw in caption_keywords):
        return ClassificationResult(
            task="CAPTION",
            confidence=0.90,
            reason="Query requests overall scene description or land cover summary."
        )

    # 5. Visual Question Answering (VQA) check
    vqa_indicators = [
        "is there", "are there", "how many", "what color", "does this", "can you see",
        "which type", "is this", "what is", "why", "how much", "identify if"
    ]
    # Check if query ends with question mark or starts with VQA indicator
    if q_clean.endswith("?") or any(indicator in q_clean for indicator in vqa_indicators):
        # Validate remote sensing / image relevance keywords
        rs_keywords = [
            "road", "water", "building", "forest", "image", "river", "land",
            "structure", "area", "tree", "field", "lake", "city", "vegetation",
            "urban", "agricultural", "sea", "ocean", "ship", "bridge", "house", "crop"
        ]
        if any(kw in q_clean for kw in rs_keywords) or any(ind in q_clean for ind in vqa_indicators):
            return ClassificationResult(
                task="VQA",
                confidence=0.85,
                reason="Query asks a specific visual question about the image content."
            )

    # 6. Fallback to UNKNOWN if no remote sensing / image patterns match
    return ClassificationResult(
        task="UNKNOWN",
        confidence=0.0,
        reason="Query does not match any supported remote-sensing vision-language task."
    )
