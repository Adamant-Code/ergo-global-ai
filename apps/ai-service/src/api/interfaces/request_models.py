# src/api/interfaces/request_models.py
from pydantic import BaseModel, Field, validator
from typing import Optional


class CompletionRequest(BaseModel):
    prompt: str = Field(
        ..., min_length=1, description="Input prompt for generating a completion"
    )
    max_tokens: Optional[int] = Field(
        50, gt=0, description="Maximum tokens to generate"
    )


class ChatRequest(BaseModel):
    message: str = Field(
        ..., min_length=1, description="User's prompt for the chat session"
    )
    session_id: Optional[str] = Field(
        None, description="Identifier for the chat session (UUID recommended)"
    )
    prev_messages: Optional[list[dict]] = Field(
        None,
        description="List of previous messages in the chat session, each with 'role' and 'content' keys",
    )

    # New fields for LLM configuration:
    model: Optional[str] = Field(
        None,
        description="LLM model identifier (e.g. openai-gpt-4o, claude-3.5-haiku, etc.)",
    )
    system_prompt: Optional[str] = Field(
        None, description="Optional system prompt to guide the conversation"
    )
    temperature: float = Field(
        0.7, ge=0.0, le=1.0, description="Temperature for response randomness"
    )
    max_tokens: Optional[int] = Field(
        100, gt=0, description="Maximum tokens to generate"
    )
    top_p: float = Field(
        1.0, ge=0.0, le=1.0, description="Nucleus sampling probability threshold"
    )
    frequency_penalty: float = Field(
        0.0, ge=0.0, le=2.0, description="Penalty for repeated tokens"
    )
    presence_penalty: float = Field(
        0.0, ge=0.0, le=2.0, description="Penalty for introducing new topics"
    )

    @validator("message")
    def non_empty_message(cls, v: str):
        if not v.strip():
            raise ValueError("Message must not be empty or whitespace.")
        return v
