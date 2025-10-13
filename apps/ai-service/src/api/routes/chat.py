# System imports
import os
import logging
import requests

# Third party imports
import boto3
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse, JSONResponse
from config.settings import settings

from src.llm.llm_provider import (
    LLMRequest,
    generate_stream,
)

from src.api.interfaces.request_models import ChatRequest
from src.api.interfaces.response_models import CompletionResponse, ChatResponse

from src.api.dependencies import (
    get_bedrock_runtime_client,
    get_bedrock_agent_runtime_client,
)
from src.llm.llm_provider import (
    call_bedrock_generate,
    call_bedrock_generate_with_zero_shot_fallback,
)
from src.prompt_engineering.templates import ERGOGLOBAL_AI_SYSTEM_PROMPT

# Initializations
router = APIRouter()
logger = logging.getLogger(__name__)

KNOWLEDGE_BASE_ID = "ERJ0GKVEAO"
MODEL_ARN = "arn:aws:bedrock:eu-west-1:038547062468:inference-profile/eu.anthropic.claude-3-5-sonnet-20240620-v1:0"
BASE_URL = (
    "http://ergoglobal-chatwoot-alb-1278403382.eu-west-1.elb.amazonaws.com/api/v1"
)


@router.post("/chatwoot/webhook", tags=["Chat"])
async def chatwoot_webhook(
    request: Request,
    bedrock_runtime_client: boto3.client = Depends(get_bedrock_runtime_client),
    bedrock_agent_runtime_client: boto3.client = Depends(
        get_bedrock_agent_runtime_client
    ),
):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail={"error_code": "invalid_payload"})

    if data.get("event") != "message_created":
        return JSONResponse(content={"action": "no_op"}, status_code=200)

    try:
        account_id = data["account"]["id"]
        messages = data["conversation"]["messages"]
        if not messages:
            raise KeyError("No messages in payload")

        recent_message = messages[0]
        conversation_id = recent_message["conversation_id"]
        query = recent_message.get("processed_message_content")
        message_type = recent_message.get("message_type")

        if not query:
            raise HTTPException(
                status_code=400, detail={"error_code": "invalid_payload"}
            )

        # Ignore if not from user (e.g., message_type != 0 means agent or note)
        if message_type != 0:
            return JSONResponse(content={"action": "no_op"}, status_code=200)

    except KeyError:
        raise HTTPException(status_code=400, detail={"error_code": "invalid_payload"})

    result = await call_bedrock_generate_with_zero_shot_fallback(
        query=query,
        bedrock_runtime_client=bedrock_runtime_client,
        bedrock_agent_runtime_client=bedrock_agent_runtime_client,
        KNOWLEDGE_BASE_ID=KNOWLEDGE_BASE_ID,
        MODEL_ARN=MODEL_ARN,
        PROMPT=ERGOGLOBAL_AI_SYSTEM_PROMPT,
    )

    if not result:
        result = "Sorry, I'm having an issue at the moment. Please try again shortly."

    url = f"{BASE_URL}/accounts/{account_id}/conversations/{conversation_id}/messages"
    headers = {"api_access_token": settings.CHATWOOT_API_ACCESS_TOKEN}
    payload = {"content": result, "message_type": "outgoing", "private": False}

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.exception("Unexpected error trying to send message from the webhook")

    return JSONResponse(content={"reply": result}, status_code=200)


@router.post("/llm/generate", response_model=ChatResponse, tags=["Chat"])
async def query_knowledge_base(
    request_body: ChatRequest,
    bedrock_runtime_client: boto3.client = Depends(get_bedrock_runtime_client),
    bedrock_agent_runtime_client: boto3.client = Depends(
        get_bedrock_agent_runtime_client
    ),
):

    try:
        result = await call_bedrock_generate_with_zero_shot_fallback(
            query=request_body.message,
            bedrock_runtime_client=bedrock_runtime_client,
            bedrock_agent_runtime_client=bedrock_agent_runtime_client,
            KNOWLEDGE_BASE_ID=KNOWLEDGE_BASE_ID,
            MODEL_ARN=MODEL_ARN,
            PROMPT=ERGOGLOBAL_AI_SYSTEM_PROMPT,
        )

        session_id = ""

        return ChatResponse(reply=result, session_id=session_id)
    except Exception as e:
        logger.exception("Unexpected error processing completion request")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/stream", tags=["Chat"])
async def stream_chat(request_body: ChatRequest):
    try:
        logger.info("Processing streaming chat request for conversation")
        user_prompt = request_body.message
        prev_messages = request_body.prev_messages or None
        model = request_body.model or "gpt-3.5-turbo"

        if not user_prompt:
            raise HTTPException(status_code=400, detail="Missing user prompt")

        llm_request = LLMRequest(
            model=model,
            timeout=30.0,
            temperature=0.5,
            messages=prev_messages,
            user_prompt=user_prompt,
        )

        async def event_generator():
            async for chunk in generate_stream(llm_request):
                yield chunk

        return StreamingResponse(event_generator(), media_type="text/plain")
    except Exception as e:
        logger.exception(f"Unexpected error processing streaming chat request: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
