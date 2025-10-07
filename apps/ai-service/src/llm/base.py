# src/llm/base.py
from abc import ABC, abstractmethod

class BaseLLMClient(ABC):
    @abstractmethod
    def complete(self, prompt: str, max_tokens: int = 50) -> dict:
        pass

    @abstractmethod
    def chat(self, message: str) -> dict:
        pass
