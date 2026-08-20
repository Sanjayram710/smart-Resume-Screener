import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.deps import get_db, get_llm_service
from app.db.base import Base
from app.main import app
from app.services.llm_service import MockLLMProvider, LLMService

# In-memory SQLite for isolated automated test runs
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    def override_get_llm_service():
        svc = LLMService()
        svc.provider = MockLLMProvider()
        return svc

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_llm_service] = override_get_llm_service

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
