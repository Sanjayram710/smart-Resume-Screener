from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class MatchedSkill(Base):
    __tablename__ = "matched_skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    screening_id = Column(Integer, ForeignKey("screenings.id", ondelete="CASCADE"), nullable=False, index=True)
    skill = Column(String(255), nullable=False)
    match_type = Column(String(50), nullable=False)  # EXACT | SEMANTIC | PARTIAL
    similarity_score = Column(Float, nullable=False)

    # Relationships
    screening = relationship("Screening", back_populates="matched_skills")


class MissingSkill(Base):
    __tablename__ = "missing_skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    screening_id = Column(Integer, ForeignKey("screenings.id", ondelete="CASCADE"), nullable=False, index=True)
    skill = Column(String(255), nullable=False)
    importance = Column(String(50), nullable=False)  # REQUIRED | PREFERRED

    # Relationships
    screening = relationship("Screening", back_populates="missing_skills")
