from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.llm_service import LLMService


def get_llm_service() -> LLMService:
    """Dependency injection for LLM service."""
    return LLMService()
