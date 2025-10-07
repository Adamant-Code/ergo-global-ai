"""
Response models for the chat API endpoints.
"""

# System imports
from datetime import datetime
from typing import List, Optional

# Third party imports
from pydantic import BaseModel, Field


class CompletionResponse(BaseModel):
    completion: str = Field(..., description="Generated text completion")
    tokens_used: int = Field(
        ..., ge=0, description="Number of tokens used in the response"
    )


class ChatResponse(BaseModel):
    reply: str = Field(..., description="Chatbot's reply to the user")
    session_id: str = Field(..., description="Identifier for the chat session")


class MessageResponse(BaseModel):
    id: str = Field(..., description="Message ID")
    role: str = Field(..., description="Message role (user or assistant)")
    content: str = Field(..., description="Message content")
    created_at: datetime = Field(..., description="Message creation timestamp")


class ConversationResponse(BaseModel):
    id: str = Field(..., description="Conversation ID")
    title: Optional[str] = Field(None, description="Conversation title")
    created_at: datetime = Field(..., description="Conversation creation timestamp")
    messages: List[MessageResponse] = Field(
        default=[], description="List of messages in the conversation"
    )


class ConversationListResponse(BaseModel):
    id: str = Field(..., description="Conversation ID")
    created_at: datetime = Field(..., description="Conversation creation timestamp")
    title: Optional[str] = Field(
        None, description="Conversation title (auto-generated or first message preview)"
    )
    message_count: int = Field(
        ..., description="Number of messages in the conversation"
    )
