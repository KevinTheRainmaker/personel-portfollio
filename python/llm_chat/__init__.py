"""
LLM Chat Package — OpenRouter-based chatbot for portfolio website
"""

from .context_builder import build_system_prompt
from .openrouter_client import chat_with_fallback, call_openrouter

__all__ = [
    "build_system_prompt",
    "chat_with_fallback",
    "call_openrouter",
]

__version__ = "2.0.0"
