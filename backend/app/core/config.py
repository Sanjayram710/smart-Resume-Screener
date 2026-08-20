import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Settings
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PROJECT_NAME: str = "Smart Resume Screener"
    API_V1_STR: str = "/api"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "sqlite:///./resume_screener.db"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # LLM Settings
    LLM_MODE: str = "mock"  # "mock" | "real"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    LLM_REQUEST_TIMEOUT: int = 30
    LLM_MAX_RETRIES: int = 2

    # Storage & Uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "txt"]

    # Deterministic Scoring Weights (Default: 40% skills, 25% exp, 20% semantic, 10% edu, 5% cert)
    SCORE_WEIGHT_SKILLS: float = 0.40
    SCORE_WEIGHT_EXPERIENCE: float = 0.25
    SCORE_WEIGHT_SEMANTIC: float = 0.20
    SCORE_WEIGHT_EDUCATION: float = 0.10
    SCORE_WEIGHT_CERTIFICATIONS: float = 0.05

    # Recommendation Thresholds (Scale 1.0 - 10.0)
    SHORTLIST_THRESHOLD: float = 7.0
    REVIEW_THRESHOLD: float = 5.0

    # Semantic Matching Thresholds
    SEMANTIC_SIMILARITY_THRESHOLD: float = 0.65

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, str) and v.startswith("["):
            import json
            try:
                return json.loads(v)
            except Exception:
                return [v]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    @field_validator("ALLOWED_EXTENSIONS", mode="before")
    @classmethod
    def assemble_allowed_exts(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip().lower().lstrip(".") for i in v.split(",") if i.strip()]
        elif isinstance(v, str) and v.startswith("["):
            import json
            try:
                return [x.lower().lstrip(".") for x in json.loads(v)]
            except Exception:
                return [v]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
