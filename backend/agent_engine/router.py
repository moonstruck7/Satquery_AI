from typing import Optional, Any
from .classifier import ClassificationResult
from .tools import Tool, tool_registry

class RoutingError(ValueError):
    """Exception raised when workflow routing fails (e.g. UNKNOWN task or unregistered tool)."""
    pass

def route_task(classification: ClassificationResult, registry: Optional[Any] = None) -> Tool:
    """
    Routes a ClassificationResult to a registered Tool.

    Args:
        classification: ClassificationResult output from classifier.py.
        registry: Optional custom ToolRegistry instance (defaults to shared tool_registry).

    Returns:
        Tool: The selected registered workflow tool.

    Raises:
        RoutingError: If classification task is UNKNOWN or not registered.
    """
    if classification.task == "UNKNOWN":
        raise RoutingError(f"Cannot route query: task is UNKNOWN ({classification.reason})")

    active_registry = registry or tool_registry

    try:
        tool = active_registry.get(classification.task)
        return tool
    except KeyError as e:
        raise RoutingError(f"Routing failed: Task '{classification.task}' is not registered.") from e
