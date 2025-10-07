# src/utils/cache.py
import functools
import logging
import time
import hashlib
import json
from typing import Any, Callable, Dict, Optional, Tuple, Union
from collections import OrderedDict

logger = logging.getLogger(__name__)

class LRUCache:
    """
    LRU (Least Recently Used) cache implementation with TTL support.
    """
    def __init__(self, maxsize: int = 128, ttl: Optional[int] = None):
        """
        Initialize LRU cache.
        
        Args:
            maxsize: Maximum number of items to store in cache
            ttl: Time-to-live in seconds, None means no expiration
        """
        self.maxsize = maxsize
        self.ttl = ttl
        self.cache = OrderedDict()  # {key: (value, timestamp)}
        self.hits = 0
        self.misses = 0
    
    def get(self, key: str) -> Tuple[bool, Any]:
        """
        Get item from cache.
        
        Args:
            key: Cache key
            
        Returns:
            Tuple of (hit, value). If hit is False, value is None.
        """
        if key not in self.cache:
            self.misses += 1
            return False, None
        
        value, timestamp = self.cache[key]
        
        # Check if entry has expired
        if self.ttl is not None and time.time() - timestamp > self.ttl:
            del self.cache[key]
            self.misses += 1
            return False, None
        
        # Move item to end to mark as recently used
        self.cache.move_to_end(key)
        self.hits += 1
        return True, value
    
    def put(self, key: str, value: Any) -> None:
        """
        Store item in cache.
        
        Args:
            key: Cache key
            value: Value to store
        """
        # If key exists, update and move to end
        if key in self.cache:
            self.cache.move_to_end(key)
        
        # Add new entry
        self.cache[key] = (value, time.time())
        
        # Remove oldest item if maxsize exceeded
        if len(self.cache) > self.maxsize:
            self.cache.popitem(last=False)
    
    def clear(self) -> None:
        """Clear the cache."""
        self.cache.clear()
    
    def get_stats(self) -> Dict[str, Union[int, float]]:
        """Get cache statistics."""
        total = self.hits + self.misses
        hit_rate = (self.hits / total) * 100 if total > 0 else 0
        return {
            "hits": self.hits,
            "misses": self.misses,
            "total": total,
            "hit_rate": hit_rate,
            "size": len(self.cache),
            "maxsize": self.maxsize,
        }

def _hash_args(*args, **kwargs) -> str:
    """
    Create a hash from function arguments.
    Handles complex types like lists and dicts.
    """
    # Convert args and kwargs to a stable JSON representation
    serialized = json.dumps((args, kwargs), sort_keys=True, default=str)
    return hashlib.md5(serialized.encode()).hexdigest()

def lru_model_cache(maxsize: int = 100, ttl: Optional[int] = 3600):
    """
    Decorator that caches function results using an LRU cache.
    Specifically designed for LLM responses with model awareness.
    
    Args:
        maxsize: Maximum number of items to store in cache
        ttl: Cache time-to-live in seconds (default: 1 hour)
    """
    cache = LRUCache(maxsize=maxsize, ttl=ttl)
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Skip caching for anything with 'stream=True' in kwargs
            if kwargs.get('stream') is True:
                logger.debug("Skipping cache for streaming request")
                return func(*args, **kwargs)
            
            # Create a cache key using all args and selected kwargs
            # We filter out kwargs that would change the response (like temperature)
            cacheable_kwargs = {k: v for k, v in kwargs.items() 
                              if k not in ['stream', 'user', 'request_id']}
            
            cache_key = _hash_args(*args, **cacheable_kwargs)
            hit, cached_result = cache.get(cache_key)
            
            if hit:
                logger.info(f"Cache hit for {func.__name__}")
                return cached_result
            
            logger.info(f"Cache miss for {func.__name__}")
            result = func(*args, **kwargs)
            cache.put(cache_key, result)
            
            # Log stats occasionally
            if (cache.hits + cache.misses) % 100 == 0:
                stats = cache.get_stats()
                logger.info(f"Cache stats for {func.__name__}: {stats}")
                
            return result
        return wrapper
    return decorator
