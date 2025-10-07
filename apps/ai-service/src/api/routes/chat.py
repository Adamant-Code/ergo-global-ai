# System imports
import logging

# Third party imports
from fastapi import (
    APIRouter,
    HTTPException,
)
from fastapi.responses import StreamingResponse

from src.llm.llm_provider import (
    LLMRequest,
    generate_stream,
)

from src.api.interfaces.request_models import ChatRequest

# Initializations
router = APIRouter()
logger = logging.getLogger(__name__)


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
