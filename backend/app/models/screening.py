from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class Screening(Base):
    __tablename__ = "screenings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Deterministic Scores (1.0 to 10.0 overall, component subscores 0 to 100)
    overall_score = Column(Float, nullable=False, index=True)
    skill_score = Column(Float, nullable=False)
    experience_score = Column(Float, nullable=False)
    education_score = Column(Float, nullable=False)
    certification_score = Column(Float, nullable=False)
    semantic_score = Column(Float, nullable=False)
    
    # Recommendation: SHORTLIST | REVIEW | NOT_RECOMMENDED
    recommendation = Column(String(50), nullable=False, index=True)
    explanation = Column(Text, nullable=False)
    
    # Structured qualitative insights
    strengths = Column(JSON, default=list, nullable=False)
    gaps = Column(JSON, default=list, nullable=False)
    llm_assessment = Column(JSON, default=dict, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    job = relationship("Job", back_populates="screenings")
    candidate = relationship("Candidate", back_populates="screenings")
    matched_skills = relationship("MatchedSkill", back_populates="screening", cascade="all, delete-orphan")
    missing_skills = relationship("MissingSkill", back_populates="screening", cascade="all, delete-orphan")
