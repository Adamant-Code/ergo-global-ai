"""
Main entry point for the AI service application.
This module initializes the FastAPI application and sets up routes and middleware.
"""

# Third party imports
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Local imports
from config.logging_config import setup_logging
from src.api.routes import completion, chat, health
from src.handlers.error_handler import add_exception_handlers


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    setup_logging()

    app = FastAPI(
        version="1.0.0",
        docs_url="/api/v1/docs",
        title="AI Service",
        redoc_url="/api/v1/redoc",
        openapi_url="/api/v1/openapi.json",
        description="Stateless AI service for LLM processing and streaming responses.",
    )

    # Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

    # Error Handlers
    add_exception_handlers(app)

    # Routers (API Endpoints)
    app.include_router(chat.router, prefix="/api/v1")
    app.include_router(completion.router, prefix="/api/v1")
    app.include_router(health.router, prefix="/api/v1/health")

    return app


app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
