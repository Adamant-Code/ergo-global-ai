# System imports
from typing import Optional, Dict, List, Any

# Local imports
from src.prompt_engineering.templates import default_system_prompt


def merge_prompts_messages(
    *,
    user_prompt: str,
    include_html_format: bool = False,
    system_prompt: Optional[str] = None,
    messages: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, str]]:
    """
    Helper function to merge user and system prompts with past messages in proper format.
    """
    prompt_messages = []

    system_content = ""
    if include_html_format:
        system_content = default_system_prompt
    if system_prompt:
        system_content += system_prompt
    elif include_html_format:
        system_content = system_content.strip()
    if system_content:
        prompt_messages.append({"role": "system", "content": system_content})
    if messages:
        # Messages are already in dict format with 'role' and 'content' keys
        prompt_messages.extend(messages)
    prompt_messages.append({"role": "user", "content": user_prompt})

    return prompt_messages
