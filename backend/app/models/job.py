from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)

    # Requirements
    required_skills = Column(JSON, default=list, nullable=False)
    preferred_skills = Column(JSON, default=list, nullable=False)
    minimum_experience = Column(Float, default=0.0, nullable=False)
    education_requirements = Column(JSON, default=list, nullable=False)
    certifications = Column(JSON, default=list, nullable=False)

    # Structured context
    keywords = Column(JSON, default=list, nullable=False)
    responsibilities = Column(JSON, default=list, nullable=False)
    important_requirements = Column(JSON, default=list, nullable=False)
    nice_to_have_requirements = Column(JSON, default=list, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    resumes = relationship("Resume", back_populates="job", cascade="all, delete-orphan")
    screenings = relationship("Screening", back_populates="job", cascade="all, delete-orphan")
