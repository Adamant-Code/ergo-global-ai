# src/api/dependencies.py
import boto3
from botocore.config import Config
from typing import Generator
from fastapi import Depends
from config.settings import settings
from src.llm.openai_client import OpenAIClient
from src.llm.claude_client import ClaudeClient

REGION: str = 'eu-west-1'

def get_settings():
    return settings

def get_openai_client(cfg = Depends(get_settings)) -> Generator[OpenAIClient, None, None]:
    client = OpenAIClient(api_key=cfg.LLM_API_KEY, default_max_tokens=cfg.DEFAULT_MAX_TOKENS)
    yield client

def get_claude_client(cfg = Depends(get_settings)) -> Generator[ClaudeClient, None, None]:
    client = ClaudeClient(api_key=cfg.CLAUDE_API_KEY, default_max_tokens=cfg.DEFAULT_MAX_TOKENS)
    yield client

def get_bedrock_client() -> boto3.client:
    """
    Create and return a Bedrock client with the specified configuration
    """
    config = Config(
        region_name=REGION,
        retries={
            'max_attempts': 3,
            'mode': 'standard'
        }
    )
    return boto3.client('bedrock-agent-runtime', config=config)