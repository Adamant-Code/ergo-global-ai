import json
import boto3
import re
import logging
import uuid
from fastapi import HTTPException
from langchain_core.prompts import PromptTemplate
from langchain_community.chat_message_histories import ChatMessageHistory
from src.llm.tools import ToolsList
from src.prompt_engineering.templates import ERGOGLOBAL_AI_SYSTEM_PROMPT
from src.api.dependencies import (
    get_bedrock_agent_runtime_client,
    get_bedrock_client,
    get_bedrock_runtime_client,
)
from botocore.exceptions import (
    EndpointConnectionError,
    ConnectTimeoutError,
)

logger = logging.getLogger(__name__)

KNOWLEDGE_BASE_ID = "ERJ0GKVEAO"
MODEL_ARN = "arn:aws:bedrock:eu-west-1:038547062468:inference-profile/eu.anthropic.claude-3-5-sonnet-20240620-v1:0"


class ConversationalRAGWithLangchain:
    def __init__(
        self,
        bedrock_runtime_client: boto3.client,
        bedrock_agent_runtime_client: boto3.client,
        knowledge_base_id: str,
        model_id: str = "anthropic.claude-3-haiku-20240307-v1:0",
    ) -> None:
        """
        Initializes a conversational RAG agent using AWS Bedrock.

        Args:
            bedrock_runtime_client (boto3.client): Bedrock runtime client for LLM inference.
            bedrock_agent_runtime_client (boto3.client): Bedrock Agent runtime client for retrieval.
            knowledge_base_id (str): Bedrock Knowledge Base ID.
            model_id (str): Bedrock model to use (default: Claude 3 Haiku).
        """
        self.model_id = model_id
        self.bedrock_runtime_client = bedrock_runtime_client
        self.bedrock_agent_runtime_client = bedrock_agent_runtime_client
        self.knowledge_base_id = knowledge_base_id
        # Instantiate memory to keep conversation history
        self.memory = ChatMessageHistory()

    def retrieve_top_k_chunks(self, q: str, top_k: int = 3):
        """Retrieve the top-K context chunks from the knowledge base."""
        response = self.bedrock_agent_runtime_client.retrieve(
            knowledgeBaseId=self.knowledge_base_id,
            retrievalQuery={"text": q},
            retrievalConfiguration={
                "vectorSearchConfiguration": {"numberOfResults": top_k}
            },
        )

        search_results = response.get("retrievalResults", [])
        context_chunks = [r["content"]["text"] for r in search_results]
        context_string = "\n".join(context_chunks)
        return context_string, search_results

    async def call_bedrock_generate_with_zero_shot_fallback(
        self,
        query: str,
        context: str,
        history: str,
        account_id: str = "",
        conversation_id: str = "",
    ) -> str:
        """
        Performs RAG-based generation; falls back to zero-shot when retrieval fails.
        """
        try:
            # client = get_bedrock_client()
            # guardrail_response = client.create_guardrail(
            #     name="contextual-grounding-guardrail-{}".format(str(uuid.uuid4())[:4]),
            #     contextualGroundingPolicyConfig={
            #         "filtersConfig": [
            #             {"type": "GROUNDING", "threshold": 0.5},
            #             {"type": "RELEVANCE", "threshold": 0.5},
            #         ]
            #     },
            #     blockedInputMessaging="Sorry, I can not respond to this.",
            #     blockedOutputsMessaging="Sorry, I can not respond to this.",
            # )
            # guardrailId = guardrail_response["guardrailId"]

            if context.strip():
                ERGOGLOBAL_PROMPT_TEMPLATE = PromptTemplate(
                    input_variables=["context", "history", "query"],
                    template=ERGOGLOBAL_AI_SYSTEM_PROMPT,
                )

                logger.info("Retrieved context found. Using RAG path.")
                prompt_text = ERGOGLOBAL_PROMPT_TEMPLATE.format(
                    context=context,
                    history=history,
                    query=query,
                    account_id=account_id,
                    conversation_id=conversation_id,
                )
            else:
                logger.info("No context retrieved. Proceeding with zero-shot fallback.")
                prompt_text = f"""
                You’re provided with a tool that can offload a conversation to a human agent called offload_conversation_to_agent;
                only use the tool if the conversation requires human involvement. You may call the tool multiple times in the same response if necessary.
                Do not mention or reference the tool or the offloading process in your final answer once offloading is successful say conversation is offloaded to agent our agents will contact you soon.

                If the customer reports software issues (e.g., "can't log in," "page not loading," "persistent errors"), immediately classify it as a software/system issue and escalate to a human agent using the `offload_conversation_to_agent` tool.  

                You are an intelligent assistant. Answer the following question based on your knowledge:
                {query}
                {account_id}
                {conversation_id}
                
                Previous conversation:
                {history}

                Please give a clear and complete answer without citing or mentioning sources or URLs.
                """

            # guardrail_config = {
            #     "guardrailIdentifier": guardrailId,
            #     "guardrailVersion": "DRAFT",
            #     "trace": "enabled",
            # }
            inferenceConfig = {
                "temperature": 0.0,
                "topP": 0.9,
                "maxTokens": 5000,  # based on the discussion max token is set to be between 3 - 5 k
            }
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"text": prompt_text}
                        # {
                        #     "guardContent": {
                        #         "text": {
                        #             "text": str(context),
                        #             "qualifiers": ["grounding_source"],
                        #         }
                        #     }
                        # },
                        # {
                        #     "guardContent": {
                        #         "text": {
                        #             "text": query,
                        #             "qualifiers": ["query"],
                        #         }
                        #     }
                        # },
                    ],
                }
            ]

            toolConfig = {
                "tools": [
                    tool.bedrock_schema
                    for tool in ToolsList.__dict__.values()
                    if hasattr(tool, "bedrock_schema")
                ],
                "toolChoice": {"auto": {}},
            }

            result = self.bedrock_runtime_client.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig=inferenceConfig,
                # guardrailConfig=guardrail_config,
                performanceConfig={"latency": "standard"},
                toolConfig=toolConfig,
            )

            function_calling = [
                c["toolUse"]
                for c in result["output"]["message"]["content"]
                if "toolUse" in c
            ]
            if function_calling:
                messages = []
                messages.append(result["output"]["message"])
                tool_result_message = {"role": "user", "content": []}
                for function in function_calling:
                    tool_name = function["name"]
                    tool_args = function["input"] or {}
                    tool_class = ToolsList()
                    tool_response = json.dumps(
                        getattr(tool_class, tool_name)(**tool_args)
                    )
                    tool_result_message["content"].append(
                        {
                            "toolResult": {
                                "toolUseId": function["toolUseId"],
                                "content": [{"text": tool_response}],
                            }
                        }
                    )
                messages.append(tool_result_message)

                tool_output = self.bedrock_runtime_client.converse(
                    modelId=self.model_id,
                    messages=messages,
                    inferenceConfig=inferenceConfig,
                    # guardrailConfig=guardrail_config,
                    performanceConfig={"latency": "standard"},
                    toolConfig=toolConfig,
                )
                return (
                    tool_output.get("output", {})
                    .get("message", {})
                    .get("content", [{}])[0]
                    .get("text", "")
                )

            output = (
                result.get("output", {})
                .get("message", {})
                .get("content", [{}])[0]
                .get("text", "")
            )

            # Remove citations and cleanup
            output = re.sub(r"\[\d+\]|\(source.*?\)", "", output)
            return output.strip()

        except self.bedrock_runtime_client.exceptions.AccessDeniedException as e:
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
            logger.exception(
                "Unexpected error occurred when calling call_bedrock_generate_with_zero_shot_fallback",
                str(e),
            )
            raise HTTPException(status_code=500, detail="Something went wrong")

    async def ai_respond(
        self, user_input: str, account_id: str = "", conversation_id: str = ""
    ):
        """Responds to user input using retrieved context and conversation memory."""
        if not user_input:
            raise ValueError("user_input cannot be empty.")

        context_string, _ = self.retrieve_top_k_chunks(q=user_input)

        # Format prompt with history and input
        formatted_history = "\n".join(
            [
                f"Human: {m.content}" if m.type == "human" else f"AI: {m.content}"
                for m in self.memory.messages
            ]
        )

        ai_output = await self.call_bedrock_generate_with_zero_shot_fallback(
            query=user_input,
            context=context_string,
            history=formatted_history,
            account_id=account_id,
            conversation_id=conversation_id,
        )

        # Store messages
        self.memory.add_user_message(user_input)
        self.memory.add_ai_message(ai_output)

        return ai_output


rag = ConversationalRAGWithLangchain(
    bedrock_runtime_client=get_bedrock_runtime_client(),
    bedrock_agent_runtime_client=get_bedrock_agent_runtime_client(),
    knowledge_base_id=KNOWLEDGE_BASE_ID,
    model_id=MODEL_ARN,
)
