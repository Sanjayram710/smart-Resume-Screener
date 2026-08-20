from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.exceptions import ResourceNotFoundException
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.job_repository import JobRepository
from app.repositories.screening_repository import ScreeningRepository
from app.schemas.candidate import CandidateDetail, CandidateResponse
from app.schemas.common import APIResponse

router = APIRouter(tags=["Candidates"])


@router.get("/jobs/{job_id}/candidates", response_model=APIResponse[List[CandidateResponse]])
def get_job_candidates(
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieves all candidate profiles associated with a job.
    """
    job_repo = JobRepository(db)
    cand_repo = CandidateRepository(db)

    job = job_repo.get_by_id(job_id)
    if not job:
        raise ResourceNotFoundException("Job", job_id)

    candidates = cand_repo.get_by_job_id(job_id)
    results = [CandidateResponse.model_validate(c) for c in candidates]

    return APIResponse(message=f"Retrieved {len(results)} candidates", data=results)


@router.get("/candidates/{candidate_id}", response_model=APIResponse[CandidateDetail])
def get_candidate_detail(
    candidate_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieves a candidate's complete profile, work history, education, projects,
    and associated screening evaluation if screened.
    """
    cand_repo = CandidateRepository(db)
    screening_repo = ScreeningRepository(db)

    candidate = cand_repo.get_by_id(candidate_id)
    if not candidate:
        raise ResourceNotFoundException("Candidate", candidate_id)

    resume = candidate.resume
    job = resume.job if resume else None

    # Check for screening record
    screening_data = None
    if job:
        screening = screening_repo.get_by_candidate_and_job(candidate_id, job.id)
        if screening:
            screening_data = {
                "id": screening.id,
                "overall_score": screening.overall_score,
                "skill_score": screening.skill_score,
                "experience_score": screening.experience_score,
                "education_score": screening.education_score,
                "certification_score": screening.certification_score,
                "semantic_score": screening.semantic_score,
                "recommendation": screening.recommendation,
                "explanation": screening.explanation,
                "strengths": screening.strengths or [],
                "gaps": screening.gaps or [],
                "llm_assessment": screening.llm_assessment or {},
                "matched_skills": [
                    {
                        "id": ms.id,
                        "skill": ms.skill,
                        "match_type": ms.match_type,
                        "similarity_score": ms.similarity_score,
                    }
                    for ms in screening.matched_skills
                ],
                "missing_skills": [
                    {
                        "id": ms.id,
                        "skill": ms.skill,
                        "importance": ms.importance,
                    }
                    for ms in screening.missing_skills
                ],
                "created_at": screening.created_at.isoformat(),
            }

    detail = CandidateDetail(
        id=candidate.id,
        resume_id=candidate.resume_id,
        name=candidate.name,
        email=candidate.email,
        phone=candidate.phone,
        summary=candidate.summary,
        skills=candidate.skills or [],
        technical_skills=candidate.technical_skills or [],
        soft_skills=candidate.soft_skills or [],
        years_of_experience=candidate.years_of_experience,
        certifications=candidate.certifications or [],
        education=candidate.education or [],
        experience=candidate.experience or [],
        projects=candidate.projects or [],
        extraction_warnings=candidate.extraction_warnings or [],
        created_at=candidate.created_at,
        job_id=job.id if job else None,
        job_title=job.title if job else None,
        resume_filename=resume.filename if resume else None,
        screening=screening_data,
    )

    return APIResponse(message="Candidate details retrieved successfully", data=detail)
