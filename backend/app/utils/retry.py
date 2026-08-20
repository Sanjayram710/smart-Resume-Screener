import asyncio
import functools
import time
from typing import Any, Callable, Tuple, Type

from app.core.logging import logger


def async_retry(
    retries: int = 2,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: Tuple[Type[Exception], ...] = (Exception,),
):
    """
    Async retry decorator with exponential backoff.
    """

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            current_delay = delay
            for attempt in range(1, retries + 1):
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    if attempt == retries:
                        logger.error(
                            f"[AsyncRetry] Function {func.__name__} failed after {retries} attempts: {e}"
                        )
                        raise
                    logger.warning(
                        f"[AsyncRetry] Function {func.__name__} failed (attempt {attempt}/{retries}): {e}. "
                        f"Retrying in {current_delay:.2f}s..."
                    )
                    await asyncio.sleep(current_delay)
                    current_delay *= backoff

        return wrapper

    return decorator


def sync_retry(
    retries: int = 2,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: Tuple[Type[Exception], ...] = (Exception,),
):
    """
    Synchronous retry decorator with exponential backoff.
    """

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            current_delay = delay
            for attempt in range(1, retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == retries:
                        logger.error(
                            f"[SyncRetry] Function {func.__name__} failed after {retries} attempts: {e}"
                        )
                        raise
                    logger.warning(
                        f"[SyncRetry] Function {func.__name__} failed (attempt {attempt}/{retries}): {e}. "
                        f"Retrying in {current_delay:.2f}s..."
                    )
                    time.sleep(current_delay)
                    current_delay *= backoff

        return wrapper

    return decorator
