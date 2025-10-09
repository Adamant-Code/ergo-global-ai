# System imports
import logging

# Third party imports
import boto3
from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
)
from fastapi.responses import StreamingResponse

from src.llm.llm_provider import (
    LLMRequest,
    generate_stream,
)

from src.api.interfaces.request_models import ChatRequest
from src.api.interfaces.response_models import CompletionResponse, ChatResponse
from src.prompt_engineering.templates import ERGOGLOBAL_AI_SYSTEM_PROMPT

from src.api.dependencies import get_bedrock_client

import boto3
from botocore.exceptions import (
    ClientError,
    EndpointConnectionError,
    ConnectTimeoutError,
)

# Initializations
router = APIRouter()
logger = logging.getLogger(__name__)

KNOWLEDGE_BASE_ID = "ERJ0GKVEAO"
MODEL_ARN = "arn:aws:bedrock:eu-west-1:038547062468:inference-profile/eu.anthropic.claude-3-5-sonnet-20240620-v1:0"


@router.post("/llm/generate", response_model=ChatResponse, tags=["Chat"])
async def query_knowledge_base(
    request_body: ChatRequest,
    bedrock_client: boto3.client = Depends(get_bedrock_client),
):
    try:
        logger.info(f"Received response generate request: {request_body}")

        bedrock_kwargs = {
            "input": {"text": request_body.message},
            "retrieveAndGenerateConfiguration": {
                "type": "KNOWLEDGE_BASE",
                "knowledgeBaseConfiguration": {
                    "knowledgeBaseId": KNOWLEDGE_BASE_ID,
                    "modelArn": request_body.model or MODEL_ARN,
                    "retrievalConfiguration": {
                        "vectorSearchConfiguration": {
                            "numberOfResults": 5,
                            "overrideSearchType": "HYBRID",
                        }
                    },
                    "generationConfiguration": {
                        "promptTemplate": {
                            "textPromptTemplate": getattr(
                                request_body, "temperature", ERGOGLOBAL_AI_SYSTEM_PROMPT
                            ),
                        },
                        "inferenceConfig": {
                            "textInferenceConfig": {
                                "temperature": getattr(
                                    request_body, "temperature", 0.0
                                ),  # Deterministic
                                "topP": getattr(request_body, "top_p", 0.9),
                                "maxTokens": getattr(request_body, "max_tokens", 400),
                            }
                        },
                        "performanceConfig": {"latency": "standard"},
                    },
                },
            },
        }

        if request_body.session_id and request_body.session_id != "string":
            bedrock_kwargs["sessionId"] = request_body.session_id

        result = bedrock_client.retrieve_and_generate(**bedrock_kwargs)

        output = result.get("output", {}).get("text", "")
        session_id = result.get("sessionId", "")

        return ChatResponse(reply=output, session_id=session_id)

    except bedrock_client.exceptions.AccessDeniedException:
        logger.error(f"Bedrock auth error: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail={
                "error_code": "upstream_auth_error",
                "message": "Authentication failed with Bedrock",
            },
        )

    except EndpointConnectionError as e:
        logger.error(f"Bedrock connection error: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail={
                "error_code": "upstream_auth_error",
                "message": "Cannot connect to Bedrock service",
            },
        )

    except ConnectTimeoutError as e:
        logger.error(f"Bedrock timeout: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail={
                "error_code": "upstream_timeout",
                "message": "Bedrock request timed out",
            },
        )

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
