# src/llm/claude_client.py
import logging
from src.llm.base import BaseLLMClient

logger = logging.getLogger(__name__)

class ClaudeClient(BaseLLMClient):
    def __init__(self, api_key: str, default_max_tokens: int = 50):
        self.api_key = api_key
        self.default_max_tokens = default_max_tokens

    def complete(self, prompt: str, max_tokens: int = None) -> dict:
        max_tokens = max_tokens or self.default_max_tokens
        logger.info(f"ClaudeClient: Generating completion with max_tokens={max_tokens}")
        # Dummy or actual API call
        return {
            "text": f"[Claude] Prompt: {prompt}",
            "tokens_used": max_tokens
        }

    def chat(self, message: str) -> dict:
        logger.info("ClaudeClient: Chat endpoint called")
        return {
            "reply": f"[Claude] Reply: {message}"
        }
