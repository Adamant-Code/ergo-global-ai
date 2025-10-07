"""Health monitoring endpoints."""

import os
import time
from typing import Dict, Any

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check() -> Dict[str, Any]:
    """Basic health check endpoint for stateless AI service."""
    return {
        "status": "healthy",
        "service": "ai-service",
        "timestamp": time.time(),
        "version": "1.0.0",
    }


@router.get("")
async def health_check_no_slash() -> Dict[str, Any]:
    """Basic health check endpoint for stateless AI service (no trailing slash)."""
    return {
        "status": "healthy",
        "service": "ai-service",
        "timestamp": time.time(),
        "version": "1.0.0",
    }


@router.get("/llm-providers")
async def llm_providers_health() -> Dict[str, Any]:
    """Check LLM provider configurations."""
    providers = {}

    # Check OpenAI configuration
    openai_key = os.getenv("OPENAI_API_KEY") or os.getenv("LLM_API_KEY")
    providers["openai"] = {
        "configured": bool(openai_key and len(openai_key) > 10),
        "status": "ready" if openai_key and len(openai_key) > 10 else "not_configured",
    }

    # Check Anthropic configuration
    anthropic_key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("LLM_API_KEY")
    providers["anthropic"] = {
        "configured": bool(anthropic_key and len(anthropic_key) > 10),
        "status": (
            "ready" if anthropic_key and len(anthropic_key) > 10 else "not_configured"
        ),
    }

    # Determine overall provider status
    configured_count = sum(1 for p in providers.values() if p["configured"])
    overall_status = "healthy" if configured_count > 0 else "warning"

    return {
        "status": overall_status,
        "providers": providers,
        "configured_providers": configured_count,
        "message": (
            "At least one LLM provider should be configured"
            if configured_count == 0
            else "LLM providers ready"
        ),
    }


@router.get("/ready")
async def readiness_check() -> Dict[str, Any]:
    """Check if service is ready to handle LLM requests."""
    try:
        # Check if at least one LLM provider is configured
        openai_configured = bool(
            os.getenv("OPENAI_API_KEY") or os.getenv("LLM_API_KEY")
        )
        anthropic_configured = bool(
            os.getenv("ANTHROPIC_API_KEY") or os.getenv("LLM_API_KEY")
        )

        ready = openai_configured or anthropic_configured

        return {
            "status": "ready" if ready else "not_ready",
            "can_process_requests": ready,
            "message": (
                "Service ready for LLM requests"
                if ready
                else "No LLM providers configured"
            ),
        }
    except Exception as e:
        return {"status": "error", "can_process_requests": False, "error": str(e)}
