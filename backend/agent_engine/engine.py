from typing import List, Union, Optional
from .classifier import classify_query
from .router import route_task, RoutingError
from .executor import execute_workflow, ExecutionResult

def run_agent(
    query: str,
    images: Optional[Union[str, List[str]]] = None,
    modalities: Optional[List[str]] = None
) -> ExecutionResult:
    """
    Main Agent Engine Orchestrator for SatQuery AI.

    Flow:
    User Query + Images -> Classifier -> Router -> Executor -> Workflow -> Model Interface -> Final Result

    Args:
        query: User natural language input prompt.
        images: Single image file path (str) or list of image file paths (List[str]).
        modalities: Optional list of image modalities (e.g. ["optical", "sar"]).

    Returns:
        ExecutionResult: Structured execution output containing task, output, success status, and error details.
    """
    # Normalize image inputs into a list
    if images is None:
        image_list = []
    elif isinstance(images, list):
        image_list = images
    elif isinstance(images, str):
        image_list = [images] if images.strip() else []
    else:
        image_list = []

    # Step 1: Query Understanding & Classification
    classification = classify_query(
        query=query,
        num_images=len(image_list),
        modalities=modalities
    )

    # Step 2: Workflow Routing
    try:
        tool = route_task(classification)
    except RoutingError as err:
        return ExecutionResult(
            task=classification.task,
            output=None,
            success=False,
            error=str(err)
        )

    # Step 3: Workflow Execution
    result = execute_workflow(
        tool=tool,
        images=image_list,
        query=query
    )

    return result
