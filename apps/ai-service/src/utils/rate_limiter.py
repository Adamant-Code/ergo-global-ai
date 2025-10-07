# src/utils/rate_limiter.py
import time
import asyncio
import logging

logger = logging.getLogger(__name__)


class RateLimiter:
    def __init__(self, calls: int = 60, period: float = 60.0):
        """
        Initialize the rate limiter.
        Default values allow 60 calls per 60 seconds.
        """
        self.calls = calls
        self.period = period
        self.timestamps = []

    def is_allowed(self) -> bool:
        now = time.time()
        # Remove timestamps that are outside the current period.
        self.timestamps = [t for t in self.timestamps if now - t < self.period]
        if len(self.timestamps) < self.calls:
            self.timestamps.append(now)
            return True
        logger.warning("Rate limit exceeded.")
        return False

    async def wait(self):
        """
        Asynchronously wait until a new call is allowed by the rate limiter.
        """
        while not self.is_allowed():
            # Sleep for a short period before checking again.
            await asyncio.sleep(0.1)
