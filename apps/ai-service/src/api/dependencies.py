# src/api/dependencies.py
import logging
import boto3
import os
from botocore.config import Config
from typing import Generator
from fastapi import Depends
from config.settings import settings
from src.llm.openai_client import OpenAIClient
from src.llm.claude_client import ClaudeClient

REGION: str = "eu-west-1"

logger = logging.getLogger(__name__)


def get_settings():
    return settings


def get_openai_client(cfg=Depends(get_settings)) -> Generator[OpenAIClient, None, None]:
    client = OpenAIClient(
        api_key=cfg.LLM_API_KEY, default_max_tokens=cfg.DEFAULT_MAX_TOKENS
    )
    yield client


def get_claude_client(cfg=Depends(get_settings)) -> Generator[ClaudeClient, None, None]:
    client = ClaudeClient(
        api_key=cfg.CLAUDE_API_KEY, default_max_tokens=cfg.DEFAULT_MAX_TOKENS
    )
    yield client


def _create_bedrock_client(service_name: str):
    """
    Internal helper to create a configured boto3 Bedrock client.
    """
    try:
        aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
        aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        
        config = Config(
            region_name=REGION,
            retries={"max_attempts": 3, "mode": "standard"},
        )
        client = boto3.client(
            service_name, 
            config=config, 
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key)
        logger.debug(f"Successfully created Bedrock client for {service_name}")
        return client
    except Exception as e:
        logger.error(f"Failed to create Bedrock client for {service_name}: {e}")
        raise


def get_bedrock_runtime_client():
    """
    Returns a Bedrock Runtime client for model text generation
    """
    return _create_bedrock_client("bedrock-runtime")


def get_bedrock_agent_runtime_client():
    """
    Returns a Bedrock Agent Runtime client for retrieval from a Knowledge Base
    """
    return _create_bedrock_client("bedrock-agent-runtime")


def get_bedrock_client():
    """
    Returns a Bedrock client
    """
    return _create_bedrock_client("bedrock")