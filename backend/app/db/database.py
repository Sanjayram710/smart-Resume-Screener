from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings
from app.core.logging import logger

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

try:
    engine = create_engine(
        settings.DATABASE_URL, connect_args=connect_args, pool_pre_ping=True, echo=False
    )
    logger.info(f"Database engine initialized with URL: {settings.DATABASE_URL.split('@')[-1]}")
except Exception as e:
    logger.warning(f"Failed to connect to primary DATABASE_URL ({e}). Falling back to SQLite.")
    engine = create_engine(
        "sqlite:///./resume_screener.db",
        connect_args={"check_same_thread": False},
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for obtaining database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
