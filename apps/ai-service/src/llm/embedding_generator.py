# File: src/llm/embedding_generator.py

from typing import List, Literal
import asyncio

from src.utils.rate_limiter import RateLimiter 
from src.utils.token_counter import count_tokens 
from src.utils.logger import logger 
from config.model_config import EMBEDDING_DIMENSIONS, COST_PER_TOKEN
from src.llm.openai_client import OpenAIClient

class EmbeddingGenerator:
    """
    A standardized interface for generating embeddings using OpenAI models.

    Acceptance criteria implemented:
    - Batch processing support: Processes texts in batches defined by `batch_size`.
    - Error handling: Catches and logs exceptions per batch.
    - Rate limiting: Uses a rate limiter before API calls.
    - Cost tracking: Tracks cost per batch using token counts and a cost rate.
    - Dimension validation: Ensures returned embeddings match expected dimensions.
    - Token counting: Uses a utility function to count tokens per text.
    - Input validation: Validates texts input and supported model.
    """
    
    def __init__(self) -> None:
        self.rate_limiter = RateLimiter()
        self.client = OpenAIClient()
        self.total_cost: float = 0.0
    
    async def generate(
        self,
        texts: List[str],
        model: Literal["text-embedding-3-large", "text-embedding-3-small"],
        batch_size: int = 100
    ) -> List[List[float]]:
        if not texts:
            raise ValueError("Input texts list is empty.")
        if not all(isinstance(t, str) for t in texts):
            raise ValueError("All items in texts must be strings.")
        if model not in ["text-embedding-3-large", "text-embedding-3-small"]:
            raise ValueError(f"Unsupported model: {model}")

        expected_dimension = EMBEDDING_DIMENSIONS.get(model)
        if expected_dimension is None:
            raise ValueError(f"No dimension configuration for model: {model}")

        results: List[List[float]] = []
        
        # Process texts in batches.
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            
            # Enforce rate limiting before calling the API.
            await self.rate_limiter.wait()
            
            # Count tokens for cost tracking.
            batch_tokens = sum(count_tokens(text) for text in batch)
            
            try:
                # Call the OpenAI API asynchronously to generate embeddings for the current batch.
                embeddings = await self.client.get_embeddings(texts=batch, model=model)
            except Exception as e:
                logger.error(f"Error generating embeddings for batch starting at index {i}: {e}")
                raise e

            # Validate that each returned embedding has the expected dimensions.
            for emb in embeddings:
                if len(emb) != expected_dimension:
                    raise ValueError(
                        f"Embedding dimension mismatch. Expected: {expected_dimension} but got {len(emb)}"
                    )
            
            results.extend(embeddings)
            
            # Track cost for the batch.
            cost = batch_tokens * COST_PER_TOKEN.get(model, 0)
            self.total_cost += cost
            logger.info(f"Processed batch {i // batch_size + 1}: {batch_tokens} tokens, cost: {cost:.6f}")

        return results
