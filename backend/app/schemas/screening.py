from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class MatchedSkillSchema(BaseModel):
    id: Optional[int] = None
    skill: str
    match_type: str  # EXACT | SEMANTIC | PARTIAL
    similarity_score: float

    model_config = ConfigDict(from_attributes=True)


class MissingSkillSchema(BaseModel):
    id: Optional[int] = None
    skill: str
    importance: str  # REQUIRED | PREFERRED

    model_config = ConfigDict(from_attributes=True)


class ScoreBreakdown(BaseModel):
    overall_score: float  # 1.0 - 10.0 scale
    skill_score: float  # 0.0 - 100.0
    experience_score: float  # 0.0 - 100.0
    education_score: float  # 0.0 - 100.0
    certification_score: float  # 0.0 - 100.0
    semantic_score: float  # 0.0 - 100.0


class ScreeningResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    overall_score: float
    skill_score: float
    experience_score: float
    education_score: float
    certification_score: float
    semantic_score: float
    recommendation: str
    explanation: str
    strengths: List[str] = []
    gaps: List[str] = []
    llm_assessment: Dict[str, Any] = {}
    matched_skills: List[MatchedSkillSchema] = []
    missing_skills: List[MissingSkillSchema] = []
    created_at: datetime

    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    resume_filename: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CandidateRankingItem(BaseModel):
    rank: int
    candidate_id: int
    screening_id: int
    candidate_name: str
    candidate_email: Optional[str] = None
    resume_id: int
    resume_filename: str
    overall_score: float
    skill_score: float
    experience_score: float
    education_score: float
    certification_score: float
    semantic_score: float
    recommendation: str
    years_of_experience: float
    matched_skills_count: int
    missing_skills_count: int
    top_skills: List[str] = []
    top_strengths: List[str] = []
    explanation_snippet: str

    model_config = ConfigDict(from_attributes=True)


class JobScreeningResult(BaseModel):
    job_id: int
    job_title: str
    company: str
    total_candidates: int
    screened_candidates_count: int
    shortlisted_count: int
    review_count: int
    not_recommended_count: int
    rankings: List[CandidateRankingItem]

    model_config = ConfigDict(from_attributes=True)
