# src/llm/openai_client.py
import logging
import openai
import asyncio
from typing import Optional, Any, Dict, AsyncGenerator, Union, List
from src.llm.base import BaseLLMClient

logger = logging.getLogger(__name__)


class OpenAIClient(BaseLLMClient):
    def __init__(
        self,
        api_key: Optional[str] = None,
        default_max_tokens: int = 50,
        base_url: Optional[str] = None,
        model: str = "gpt-3.5-turbo",  # Updated default model
        use_async: bool = False,
        azure: bool = False,
        azure_api_version: Optional[str] = None,
        azure_endpoint: Optional[str] = None,
        default_headers: Optional[Dict[str, str]] = None,
    ):
        """
        Initialize the OpenAI client.

        :param api_key: Your OpenAI API key. If not provided, openai.api_key defaults to os.environ.
        :param default_max_tokens: Fallback max_tokens value.
        :param base_url: Custom base URL (e.g., for proxy or self-hosted endpoints).
        :param model: Model name to use.
        :param use_async: If True, use the async OpenAI client.
        :param azure: If True, configure for Azure OpenAI.
        :param azure_api_version: Azure API version (e.g., "2023-07-01-preview").
        :param azure_endpoint: Azure endpoint URL.
        :param default_headers: Additional headers to add to the request.
        """
        self.default_max_tokens = default_max_tokens
        self.model = model
        self.use_async = use_async

        client_kwargs = {
            "api_key": api_key,
        }

        if base_url:
            client_kwargs["base_url"] = base_url

        if default_headers:
            client_kwargs["default_headers"] = default_headers

        if azure:
            from openai import AzureOpenAI

            # Set up Azure-specific client options
            client_kwargs["api_version"] = azure_api_version or "2023-07-01-preview"
            client_kwargs["azure_endpoint"] = azure_endpoint
            self.client = AzureOpenAI(**client_kwargs)
        else:
            if use_async:
                from openai import AsyncOpenAI

                self.client = AsyncOpenAI(**client_kwargs)
            else:
                from openai import OpenAI

                self.client = OpenAI(**client_kwargs)

    def complete(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """
        Synchronously generate a text completion using OpenAI's Completion API.
        Note: Legacy completions API is deprecated, this now uses chat completions.

        :param prompt: The prompt for generating a completion.
        :param max_tokens: Maximum tokens to generate (defaults to self.default_max_tokens).
        :return: Dictionary with "text" and "tokens_used".
        """
        max_tokens = max_tokens or self.default_max_tokens
        logger.info(
            f"OpenAIClient: Generating completion using model={self.model} with max_tokens={max_tokens}"
        )

        try:
            # Using chat completions instead of legacy completions API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                **kwargs,
            )

            # Extract text from the response
            text = (
                response.choices[0].message.content.strip() if response.choices else ""
            )
            tokens_used = (
                response.usage.total_tokens
                if hasattr(response, "usage")
                else max_tokens
            )

            logger.info("OpenAIClient: Completion generated successfully")
            return {"text": text, "tokens_used": tokens_used}
        except Exception as e:
            logger.exception("OpenAIClient: Error generating completion")
            raise e

    def chat(
        self,
        message: Union[str, List[Dict[str, str]]],
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """
        Synchronously process a chat message using OpenAI's ChatCompletion API.
        :param message: A string message or a list of messages (for complex multi-part prompts).
        :return: Dictionary with "reply".
        """
        logger.info(f"OpenAIClient: Processing chat message using model={self.model}")
        try:
            # If message is a string, wrap it as a single user message.
            if isinstance(message, str):
                messages = [{"role": "user", "content": message}]
            elif isinstance(message, list):
                messages = message
            else:
                raise ValueError(
                    "Invalid message format. Must be a string or list of message dicts."
                )

            response = self.client.chat.completions.create(
                model=self.model, messages=messages, **kwargs
            )

            reply = (
                response.choices[0].message.content.strip() if response.choices else ""
            )
            logger.info("OpenAIClient: Chat reply generated successfully")
            return {"reply": reply}
        except Exception as e:
            logger.exception("OpenAIClient: Error during chat completion")
            raise e

    async def acomplete(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """
        Asynchronously generate a text completion using OpenAI's Completion API.

        :param prompt: The prompt for generating a completion.
        :param max_tokens: Maximum tokens to generate.
        :return: Dictionary with "text" and "tokens_used".
        """
        if not self.use_async:
            raise RuntimeError("Async mode is not enabled for this client instance.")
        max_tokens = max_tokens or self.default_max_tokens
        logger.info(
            f"OpenAIClient (Async): Generating completion using model={self.model} with max_tokens={max_tokens}"
        )

        try:
            # Using chat completions instead of legacy completions API
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                **kwargs,
            )

            text = (
                response.choices[0].message.content.strip() if response.choices else ""
            )
            tokens_used = (
                response.usage.total_tokens
                if hasattr(response, "usage")
                else max_tokens
            )

            logger.info("OpenAIClient (Async): Completion generated successfully")
            return {"text": text, "tokens_used": tokens_used}
        except Exception as e:
            logger.exception("OpenAIClient (Async): Error generating completion")
            raise e

    async def achat(
        self,
        message: Union[str, List[Dict[str, str]]],
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """
        Asynchronously process a chat message using OpenAI's ChatCompletion API.
        :param message: A string message or a list of messages.
        :return: Dictionary with "reply".
        """
        if not self.use_async:
            raise RuntimeError("Async mode is not enabled for this client instance.")
        logger.info(
            f"OpenAIClient (Async): Processing chat message using model={self.model}"
        )
        try:
            if isinstance(message, str):
                messages = [{"role": "user", "content": message}]
            elif isinstance(message, list):
                messages = message
            else:
                raise ValueError(
                    "Invalid message format. Must be a string or list of message dicts."
                )

            response = await self.client.chat.completions.create(
                model=self.model, messages=messages, **kwargs
            )

            reply = (
                response.choices[0].message.content.strip() if response.choices else ""
            )
            logger.info("OpenAIClient (Async): Chat reply generated successfully")
            return {"reply": reply}
        except Exception as e:
            logger.exception("OpenAIClient (Async): Error during chat completion")
            raise e

    async def astream_chat(
        self,
        messages: List[Dict[str, str]],
        **kwargs: Any,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Asynchronously stream chat responses using OpenAI's ChatCompletion API.
        Yields chunks of the response as they arrive.
        :param message: A string or list of messages.
        :yield: Chunks of response data.
        """
        if not self.use_async:
            raise RuntimeError("Async mode is not enabled for this client instance.")
        logger.info(
            f"OpenAIClient (Async): Streaming chat response using model={self.model}"
        )
        try:
            stream = await self.client.chat.completions.create(
                model=self.model, messages=messages, stream=True, **kwargs
            )

            async for chunk in stream:
                # The structure for accessing deltas has changed in v1.0.0+
                delta = chunk.choices[0].delta.content or ""
                yield {"delta": delta}
        except Exception as e:
            logger.exception(
                "OpenAIClient (Async): Error during streaming chat completion"
            )
            raise e

    async def get_embeddings(self, texts: List[str], model: str) -> List[List[float]]:
        """
        Asynchronously retrieve embeddings for a list of texts using OpenAI's Embedding API.

        :param texts: List of input texts to generate embeddings.
        :param model: The model identifier for generating embeddings.
        :return: A list of embeddings where each embedding is a list of floats.
        """
        if not texts:
            raise ValueError("No texts provided for embedding generation.")

        try:
            if self.use_async:
                response = await self.client.embeddings.create(input=texts, model=model)
            else:
                response = await asyncio.to_thread(
                    self.client.embeddings.create, input=texts, model=model
                )
        except Exception as e:
            logger.exception("OpenAIClient: Error generating embeddings")
            raise e

        if not response or "data" not in response:
            logger.error("OpenAIClient: Invalid response structure for embeddings")
            raise ValueError("Invalid response structure for embeddings")

        embeddings = []
        for item in response["data"]:
            if "embedding" not in item:
                logger.error("OpenAIClient: Missing 'embedding' in response data item")
                raise ValueError("Invalid response structure: missing 'embedding'")
            embeddings.append(item["embedding"])

        return embeddings
