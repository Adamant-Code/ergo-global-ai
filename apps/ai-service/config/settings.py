# config/settings.py
from pydantic import Field
from pydantic.v1.env_settings import BaseSettings
from typing import Optional


class AppSettings(BaseSettings):
    API_KEY: str = Field(None, env="API_KEY")
    ENV: str = Field(
        "development",
        description="Application environment (development/production/test)",
    )

    # API keys
    LLM_API_KEY: Optional[str] = Field(None, env="LLM_API_KEY")

    CHATWOOT_API_ACCESS_TOKEN: str = Field(None, env="CHATWOOT_API_ACCESS_TOKEN")

    # Any other environment-based settings
    DEFAULT_MAX_TOKENS: int = Field(
        50, description="Default max tokens for completions"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Singleton instance
settings = AppSettings()
