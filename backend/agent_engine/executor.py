from dataclasses import dataclass, asdict
from typing import List, Union, Optional, Any, Dict
from .tools import Tool

@dataclass
class ExecutionResult:
    """
    Structured result returned by the Agent Engine Executor.
    """
    task: str
    output: Optional[Any]
    success: bool
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def execute_workflow(
    tool: Tool,
    images: Union[str, List[str]],
    query: str
) -> ExecutionResult:
    """
    Executes a registered Tool workflow after validating image count and inputs.

    Args:
        tool: Tool object selected by the router.
        images: Single image path (str) or list of image paths (List[str]).
        query: User prompt or question string.

    Returns:
        ExecutionResult: Structured execution output with status and error details.
    """
    if not isinstance(tool, Tool):
        tool_name = getattr(tool, "name", "INVALID_TOOL")
        return ExecutionResult(
            task=tool_name,
            output=None,
            success=False,
            error=f"Invalid tool object provided: expected Tool instance, got {type(tool).__name__}"
        )

    # Normalize image input into a list
    if isinstance(images, list):
        image_list = images
    elif isinstance(images, str):
        image_list = [images] if images.strip() else []
    else:
        image_list = []

    # 1. Validate image count against tool's requirement
    if len(image_list) != tool.required_image_count:
        err_msg = (
            f"Image count mismatch for tool '{tool.name}': "
            f"expected {tool.required_image_count} image(s), but got {len(image_list)}."
        )
        return ExecutionResult(
            task=tool.name,
            output=None,
            success=False,
            error=err_msg
        )

    # 2. Execute tool handler with error isolation
    try:
        if not callable(tool.handler):
            return ExecutionResult(
                task=tool.name,
                output=None,
                success=False,
                error=f"Tool '{tool.name}' has non-callable handler."
            )

        output = tool.handler(images=image_list, query=query)
        return ExecutionResult(
            task=tool.name,
            output=output,
            success=True,
            error=None
        )
    except Exception as e:
        return ExecutionResult(
            task=tool.name,
            output=None,
            success=False,
            error=f"Execution error in handler for tool '{tool.name}': {str(e)}"
        )
