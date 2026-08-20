import logging
import sys

from app.core.config import settings


def setup_logging() -> logging.Logger:
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    # Format with timestamp, level, logger name, and message
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s:%(lineno)d] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Clear existing handlers to avoid duplicates
    if root_logger.hasHandlers():
        root_logger.handlers.clear()

    root_logger.addHandler(handler)

    # Set external libraries to warning to keep logs clean
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("fitz").setLevel(logging.WARNING)

    logger = logging.getLogger("smart_resume_screener")
    logger.setLevel(log_level)
    return logger


logger = setup_logging()
