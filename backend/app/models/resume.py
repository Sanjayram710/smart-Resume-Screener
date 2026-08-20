from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processing_status = Column(String(50), default="PENDING", nullable=False, index=True)
    file_hash = Column(String(64), nullable=False, index=True)
    file_path = Column(String(500), nullable=True)
    error_message = Column(Text, nullable=True)

    # Relationships
    job = relationship("Job", back_populates="resumes")
    candidate = relationship("Candidate", back_populates="resume", uselist=False, cascade="all, delete-orphan")
