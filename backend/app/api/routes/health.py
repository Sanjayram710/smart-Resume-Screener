from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.api.deps import get_db
from app.core.config import settings
from app.schemas.common import HealthStatus

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthStatus)
def check_health(db: Session = Depends(get_db)):
    """
    Health check endpoint returning system status, database connection, and LLM configuration.
    """
    db_connected = False
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    return HealthStatus(
        status="healthy" if db_connected else "degraded",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        database_connected=db_connected,
        llm_mode=settings.LLM_MODE,
    )
