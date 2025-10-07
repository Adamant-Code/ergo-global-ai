# System deps
import logging

# Third party deps
from fastapi import APIRouter, HTTPException, Depends

# Local imports
from src.llm.openai_client import OpenAIClient
from src.api.dependencies import get_openai_client
from src.api.interfaces.request_models import CompletionRequest
from src.api.interfaces.response_models import CompletionResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/complete", response_model=CompletionResponse, tags=["Completion"])
async def complete(
    request_body: CompletionRequest,
    openai_client: OpenAIClient = Depends(get_openai_client),
):
    try:
        logger.info(f"Received completion request: {request_body}")
        result = openai_client.complete(
            prompt=request_body.prompt, max_tokens=request_body.max_tokens
        )
        return CompletionResponse(
            completion=result.get("text", ""), tokens_used=result.get("tokens_used", 0)
        )
    except Exception as exc:
        logger.exception("Error processing completion request")
        raise HTTPException(status_code=500, detail=str(exc))
