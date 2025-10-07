# config/logging_config.py
import logging
import sys
import os


def setup_logging():
    """
    Environment-based logging:
      - LOCAL: logs to terminal only.
      - DEV/PROD: logs to terminal and remote log group (e.g., CloudWatch).

    Optional Error Tracking:
      - Sentry integration if SENTRY_DSN is provided.

    """
    # Determine environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "LOCAL").upper()

    # Set default log level based on environment
    log_level = logging.DEBUG if ENVIRONMENT == "LOCAL" else logging.INFO

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    )

    handlers = []
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    handlers.append(console_handler)

    if ENVIRONMENT in ["DEV", "PROD"]:
        try:
            import watchtower  # Ensure watchtower is added to requirements.txt

            cw_handler = watchtower.CloudWatchLogHandler(
                log_group="ai_service_logs", stream_name=ENVIRONMENT
            )
            cw_handler.setFormatter(formatter)
            handlers.append(cw_handler)
        except ImportError:
            logging.warning(
                "watchtower package not available; remote logging disabled."
            )

    root_logger = logging.getLogger()
    if root_logger.hasHandlers():
        root_logger.handlers.clear()

    logging.basicConfig(
        level=log_level,
        format="[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
        handlers=handlers,
    )

    # Optional: Setup error tracking with Sentry if DSN is provided
    SENTRY_DSN = os.getenv("SENTRY_DSN")
    if SENTRY_DSN:
        try:
            import sentry_sdk

            sentry_sdk.init(dsn=SENTRY_DSN, environment=ENVIRONMENT)
            logging.getLogger(__name__).info("Sentry error tracking enabled.")
        except ImportError:
            logging.getLogger(__name__).warning(
                "sentry_sdk package not available; error tracking disabled."
            )
