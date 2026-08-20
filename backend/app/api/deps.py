from app.db.database import get_db
from app.services.llm_service import LLMService


def get_llm_service() -> LLMService:
    """Dependency injection for LLM service."""
    return LLMService()


__all__ = ["get_db", "get_llm_service"]
