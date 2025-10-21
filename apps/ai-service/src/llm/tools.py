import logging
from fastapi import HTTPException
from pydantic import Field
import requests

from src.utils.tools import tool
from config.settings import settings

BASE_URL = (
    "http://ergoglobal-chatwoot-alb-1278403382.eu-west-1.elb.amazonaws.com/api/v1"
)

logger = logging.getLogger(__name__)


class ToolsList:
    @tool(
        name="offload_conversation_to_agent",
        description="Offloads conversation from bot to agent for conversations that need human beings involvement.",
    )
    def offload_conversation_to_agent(
        self,
        account_id: str = Field(..., description="Account id of a user"),
        conversation_id: str = Field(
            ..., description="Conversation id of a conversation"
        ),
    ) -> dict:
        

        url = f"{BASE_URL}/accounts/{account_id}/conversations/{conversation_id}/toggle_status"
        headers = {"api_access_token": settings.CHATWOOT_API_ACCESS_TOKEN}
        payload = {"status": "open"}

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            response.raise_for_status()  # Raise for 4xx/5xx HTTP errors
        except requests.Timeout:
            logger.exception("Request to Chatwoot timed out")
            raise HTTPException(status_code=504, detail="Request to Chatwoot timed out.")
        except requests.ConnectionError:
            logger.exception("Unable to connect to Chatwoot")
            raise HTTPException(status_code=503, detail="Unable to connect to Chatwoot.")
        except requests.HTTPError as http_err:
            status_code = response.status_code if response else 500
            logger.exception(f"HTTP error from Chatwoot: {http_err}")
            raise HTTPException(status_code=status_code, detail=f"HTTP error from Chatwoot: {http_err}")
        except requests.RequestException as req_err:
            logger.exception(f"Request error: {req_err}")
            raise HTTPException(status_code=500, detail=f"Request error: {req_err}")
        except Exception as e:
            logger.exception(f"Unexpected error: {e}")
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

        try:
            data = response.json()
        except ValueError:
            logger.exception("Invalid JSON response from Chatwoot")
            raise HTTPException(
                status_code=502,
                detail={"error": "Invalid JSON response from Chatwoot", "raw_response": response.text},
            )

        return {"message": "conversation offloaded to agent successfully"}