# src/utils/token_counter.py
import logging

logger = logging.getLogger(__name__)

try:
    import tiktoken
except ImportError:
    tiktoken = None
    logger.warning("tiktoken library not found. Falling back to basic token counting.")

def count_tokens(text: str, model: str = "gpt-3.5-turbo") -> int:
    """
    Count tokens in the given text using tiktoken for the specified model.
    Falls back to basic whitespace splitting if tiktoken is unavailable or fails.

    :param text: The text for which tokens should be counted.
    :param model: The model name to determine the token encoding (default: "gpt-3.5-turbo").
    :return: The number of tokens.
    """
    if tiktoken:
        try:
            encoding = tiktoken.encoding_for_model(model)
            tokens = encoding.encode(text)
            token_count = len(tokens)
            logger.info("Token count calculated using tiktoken: %d", token_count)
            return token_count
        except Exception as e:
            logger.exception("tiktoken failed with error: %s. Falling back to basic token counting.", e)
    # Fallback method: basic whitespace split
    tokens = text.split()
    token_count = len(tokens)
    logger.info("Token count calculated using fallback method: %d", token_count)
    return token_count
