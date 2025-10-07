# src/utils/logger.py
import logging
from config.logging_config import setup_logging

setup_logging()
logger = logging.getLogger(__name__)
