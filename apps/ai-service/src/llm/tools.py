from pydantic import Field
import requests

from src.utils.tools import tool
from config.settings import settings

BASE_URL = (
    "http://ergoglobal-chatwoot-alb-1278403382.eu-west-1.elb.amazonaws.com/api/v1"
)


class ToolsList:
    @tool(
        name="offload_conversation_to_agent",
        description="Offloads conversation from bot to agent for conversations that need human beings involvement."
    )
    def offload_conversation_to_agent(self, account_id: str = Field(..., description="Account id of a user"),  conversation_id: str = Field(..., description="Conversation id of a conversation")) -> dict:
        header_dict = {"api_access_token": settings.CHATWOOT_API_ACCESS_TOKEN}
        url = f"{BASE_URL}/accounts/{account_id}/conversations/{conversation_id}/toggle_status"
        payload = {"status": "open"}
        response = requests.post(url, json=payload, headers=header_dict).json()
        return response