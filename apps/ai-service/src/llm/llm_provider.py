"""
This module provides functionality to interact with various LLM providers,
including OpenAI, Claude, and Groq. It supports both synchronous and
asynchronous operations, rate limiting, and error handling.
"""

import asyncio
import logging
from enum import Enum
from typing import AsyncGenerator, Optional

from pydantic import BaseModel
from src.llm.openai_client import OpenAIClient
from src.llm.claude_client import ClaudeClient
from src.llm.utils import merge_prompts_messages

# from src.llm.groq_client import GroqClient  # Uncomment when implemented
from config.settings import settings
from src.utils.rate_limiter import RateLimiter
from src.utils.token_counter import count_tokens

logger = logging.getLogger(__name__)


class ModelEnum(str, Enum):
    OPENAI_GPT4O = "gpt-4o"
    OPENAI_GPT35_TURBO = "gpt-3.5-turbo"
    OPENAI_GPT4O_MINI = "gpt-4o-mini"
    OPENAI_O3_MINI = "o3-mini"
    CLAUDE_3_5_SONNET = "claude-3.5-sonnet"
    CLAUDE_3_5_HAIKU = "claude-3.5-haiku"
    GROQ_LLAMA_3_3_70B = "groq-llama-3.3-70b"
    GROQ_DEEPSEEK_R1_DISTILLED_70B = "groq-deepseek-r1-distilled-70b"


class TokenUsage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0


class ChatMessage(BaseModel):
    """Simple message model for LLM requests"""

    role: str  # 'user', 'assistant', 'system'
    content: str


class LLMRequest(BaseModel):
    model: ModelEnum
    user_prompt: str
    messages: Optional[list[ChatMessage]] = None
    system_prompt: Optional[str] = None
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    timeout: Optional[float] = 10.0  # seconds


class LLMResponse(BaseModel):
    content: str
    model: str
    usage: TokenUsage


# Example: Allow 5000 calls per minute
rate_limiter = RateLimiter(calls=5000, period=60)
DEFAULT_MAX_TOKEN = 1024


def get_provider_client(model: ModelEnum):
    """
    Returns the appropriate LLM client based on the requested model.
    For demonstration, we assume:
      - OpenAIClient for OpenAI models (gpt-4o, gpt-4o-mini, o3-mini)
      - ClaudeClient for Claude models
      - GroqClient can be integrated later for Groq models.
    """
    if model in {
        ModelEnum.OPENAI_GPT4O,
        ModelEnum.OPENAI_GPT4O_MINI,
        ModelEnum.OPENAI_GPT35_TURBO,
        ModelEnum.OPENAI_O3_MINI,
    }:
        return OpenAIClient(
            api_key=settings.LLM_API_KEY,
            default_max_tokens=DEFAULT_MAX_TOKEN,
            model=model.value,
            use_async=True,
        )
    elif model in {
        ModelEnum.CLAUDE_3_5_SONNET,
        ModelEnum.CLAUDE_3_5_HAIKU,
    }:
        return ClaudeClient(
            api_key=settings.LLM_API_KEY,
            default_max_tokens=DEFAULT_MAX_TOKEN,
            model=model.value,
            use_async=True,
        )
    elif model in {
        ModelEnum.GROQ_LLAMA_3_3_70B,
        ModelEnum.GROQ_DEEPSEEK_R1_DISTILLED_70B,
    }:
        # Uncomment and implement when GroqClient is available.
        # return GroqClient(api_key=None, default_max_tokens=100, model=model.value, use_async=True)
        raise NotImplementedError(
            f"Provider for model {model.value} is not implemented."
        )
    else:
        raise ValueError("Unsupported model type.")


MAX_RETRIES = 3
RETRY_BACKOFF = 2  # seconds (exponential backoff)


async def generate_completion(request: LLMRequest) -> LLMResponse:
    """
    Asynchronously generate a text completion using the selected provider.
    Implements rate limiting, retry logic, timeout handling, and error recovery.
    """
    client = get_provider_client(request.model)

    # Use utility function to merge prompts and messages
    prompt_messages = merge_prompts_messages(
        include_html_format=True,
        messages=request.messages,
        user_prompt=request.user_prompt,
        system_prompt=request.system_prompt,
    )

    # For clients that expect a simple prompt string, we'll need to convert
    # For now, let's use the user prompt (this may need adjustment based on client implementation)
    prompt = request.user_prompt
    if request.system_prompt:
        prompt = f"{request.system_prompt}\n{prompt}"

    retries = 0
    while retries < MAX_RETRIES:
        if not rate_limiter.is_allowed():
            await asyncio.sleep(1)
            continue

        try:
            # Timeout handling using asyncio.wait_for.
            response = await asyncio.wait_for(
                client.acomplete(
                    prompt=prompt_messages,
                    max_tokens=request.max_tokens or client.default_max_tokens,
                    temperature=request.temperature,
                    top_p=request.top_p,
                    frequency_penalty=request.frequency_penalty,
                    presence_penalty=request.presence_penalty,
                ),
                timeout=request.timeout,
            )
            # Token usage simulation; in a real response, extract from response.usage.
            prompt_tokens = count_tokens(prompt)
            completion_tokens = count_tokens(response.get("text", ""))
            usage = TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens,
            )
            return LLMResponse(
                content=response.get("text", ""),
                model=request.model.value,
                usage=usage,
            )
        except asyncio.TimeoutError:
            logger.error("Timeout during generate_completion; retrying...")
            retries += 1
            await asyncio.sleep(RETRY_BACKOFF**retries)
        except Exception as e:
            logger.exception("Error in generate_completion; retrying...")
            retries += 1
            await asyncio.sleep(RETRY_BACKOFF**retries)

    raise Exception("Max retries exceeded for generate_completion")


async def generate_stream(request: LLMRequest) -> AsyncGenerator[str, None]:
    """
    Asynchronously generate a streaming text completion using the selected provider.
    Yields chunks of text as they are received, while applying error handling and rate limiting.
    """
    if not request.user_prompt:
        raise ValueError("User prompt is required for streaming.")

    client = get_provider_client(request.model)
    prompt_messages = merge_prompts_messages(
        include_html_format=True,
        messages=request.messages,
        user_prompt=request.user_prompt,
        system_prompt=request.system_prompt,
    )

    retries = 0
    while retries < MAX_RETRIES:
        if not rate_limiter.is_allowed():
            await asyncio.sleep(1)
            continue

        try:
            stream = client.astream_chat(
                top_p=request.top_p,
                messages=prompt_messages,
                timeout=request.timeout,
                temperature=request.temperature,
                presence_penalty=request.presence_penalty,
                frequency_penalty=request.frequency_penalty,
            )
            async for chunk in stream:
                yield chunk.get("delta", "")
            return
        except asyncio.TimeoutError:
            logger.error("Timeout during generate_stream; retrying...")
            retries += 1
            await asyncio.sleep(RETRY_BACKOFF**retries)
        except Exception:
            logger.exception("Error in generate_stream; retrying...")
            retries += 1
            await asyncio.sleep(RETRY_BACKOFF**retries)

    raise Exception("Max retries exceeded for generate_stream")
