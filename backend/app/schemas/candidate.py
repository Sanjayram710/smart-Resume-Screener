from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.llm import EducationItem, ExperienceItem, ProjectItem


class CandidateBase(BaseModel):
    name: str = "Anonymous Candidate"
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = []
    technical_skills: List[str] = []
    soft_skills: List[str] = []
    years_of_experience: float = 0.0
    certifications: List[str] = []


class CandidateResponse(CandidateBase):
    id: int
    resume_id: int
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    extraction_warnings: List[str] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CandidateDetail(CandidateResponse):
    job_id: Optional[int] = None
    job_title: Optional[str] = None
    resume_filename: Optional[str] = None
    screening: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)
