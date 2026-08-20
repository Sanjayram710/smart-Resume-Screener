from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    resume_id = Column(
        Integer,
        ForeignKey("resumes.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    name = Column(String(255), default="Anonymous Candidate", nullable=False, index=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    summary = Column(Text, nullable=True)

    # Skills breakdown
    skills = Column(JSON, default=list, nullable=False)
    technical_skills = Column(JSON, default=list, nullable=False)
    soft_skills = Column(JSON, default=list, nullable=False)

    # Structured sections
    education = Column(JSON, default=list, nullable=False)
    experience = Column(JSON, default=list, nullable=False)
    certifications = Column(JSON, default=list, nullable=False)
    projects = Column(JSON, default=list, nullable=False)

    years_of_experience = Column(Float, default=0.0, nullable=False)
    embedding_vector = Column(JSON, nullable=True)
    extraction_warnings = Column(JSON, default=list, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    resume = relationship("Resume", back_populates="candidate")
    screenings = relationship("Screening", back_populates="candidate", cascade="all, delete-orphan")
