from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class JobBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255, description="Job title")
    company: str = Field(..., min_length=1, max_length=255, description="Company name")
    description: str = Field(..., min_length=10, description="Full job description text")
    required_skills: List[str] = Field(
        default_factory=list, description="Mandatory required skills"
    )
    preferred_skills: List[str] = Field(
        default_factory=list, description="Nice-to-have preferred skills"
    )
    minimum_experience: float = Field(0.0, ge=0.0, description="Minimum years of experience")
    education_requirements: List[str] = Field(
        default_factory=list, description="Required education level"
    )
    certifications: List[str] = Field(default_factory=list, description="Preferred certifications")


class JobCreate(JobBase):
    auto_extract: bool = Field(
        True, description="Whether to run LLM extraction on description if skills are empty"
    )


class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    minimum_experience: Optional[float] = None
    education_requirements: Optional[List[str]] = None
    certifications: Optional[List[str]] = None


class JobResponse(JobBase):
    id: int
    keywords: List[str] = []
    responsibilities: List[str] = []
    important_requirements: List[str] = []
    nice_to_have_requirements: List[str] = []
    created_at: datetime
    updated_at: datetime

    resume_count: int = 0
    candidate_count: int = 0
    screened_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class JobSummary(BaseModel):
    id: int
    title: str
    company: str
    required_skills: List[str]
    preferred_skills: List[str]
    minimum_experience: float
    resume_count: int = 0
    screened_count: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
