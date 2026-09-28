from dataclasses import dataclass
from typing import Callable, Dict, Any

@dataclass
class Tool:
    name: str
    description: str
    required_image_count: int
    handler: Callable[..., Any]


from agent_engine.workflows.vqa import vqa_workflow
from agent_engine.workflows.caption import caption_workflow
from agent_engine.workflows.grounding import grounding_workflow
from agent_engine.workflows.change_detection import change_detection_workflow
from agent_engine.workflows.optical_sar import optical_sar_workflow


class ToolRegistry:
    """
    Modular tool registry for SatQuery Agent Engine workflows.
    """

    def __init__(self):
        self._tools: Dict[str, Tool] = {}
        self._register_defaults()

    def register(self, tool: Tool):
        """Registers a new tool in the registry."""
        self._tools[tool.name] = tool

    def get(self, name: str) -> Tool:
        """Retrieves a registered tool by task name."""
        if name not in self._tools:
            raise KeyError(f"Tool '{name}' is not registered in ToolRegistry.")
        return self._tools[name]

    def is_registered(self, name: str) -> bool:
        """Checks if a task name is registered."""
        return name in self._tools

    def _register_defaults(self):
        """Registers the 5 core SatQuery workflows."""
        self.register(Tool(
            name="VQA",
            description="Answer visual questions about a single remote-sensing image.",
            required_image_count=1,
            handler=vqa_workflow
        ))
        self.register(Tool(
            name="CAPTION",
            description="Describe scene, land cover, and major visible content.",
            required_image_count=1,
            handler=caption_workflow
        ))
        self.register(Tool(
            name="GROUNDING",
            description="Identify or localize regions or objects referred to by the user.",
            required_image_count=1,
            handler=grounding_workflow
        ))
        self.register(Tool(
            name="CHANGE_DETECTION",
            description="Bi-temporal change analysis between two images from different times.",
            required_image_count=2,
            handler=change_detection_workflow
        ))
        self.register(Tool(
            name="OPTICAL_SAR",
            description="Joint analysis of co-registered optical/multispectral and SAR imagery.",
            required_image_count=2,
            handler=optical_sar_workflow
        ))


# Shared singleton instance
tool_registry = ToolRegistry()
