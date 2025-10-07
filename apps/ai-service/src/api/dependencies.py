# src/api/dependencies.py
from typing import Generator
from fastapi import Depends
from config.settings import settings
from src.llm.openai_client import OpenAIClient
from src.llm.claude_client import ClaudeClient

def get_settings():
    return settings

def get_openai_client(cfg = Depends(get_settings)) -> Generator[OpenAIClient, None, None]:
    client = OpenAIClient(api_key=cfg.LLM_API_KEY, default_max_tokens=cfg.DEFAULT_MAX_TOKENS)
    yield client

def get_claude_client(cfg = Depends(get_settings)) -> Generator[ClaudeClient, None, None]:
    client = ClaudeClient(api_key=cfg.CLAUDE_API_KEY, default_max_tokens=cfg.DEFAULT_MAX_TOKENS)
    yield client
