from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.core.exceptions import ResourceNotFoundException
from app.repositories.job_repository import JobRepository
from app.repositories.screening_repository import ScreeningRepository
from app.schemas.common import APIResponse
from app.schemas.screening import (
    CandidateRankingItem,
    JobScreeningResult,
    MatchedSkillSchema,
    MissingSkillSchema,
    ScreeningResponse,
)
from app.services.ranking_service import RankingService
from app.services.screening_service import ScreeningService

router = APIRouter(tags=["Screening & Rankings"])


@router.post(
    "/jobs/{job_id}/screen",
    response_model=APIResponse[JobScreeningResult],
    status_code=status.HTTP_200_OK,
)
async def screen_candidates_for_job(
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Triggers deterministic scoring, semantic matching, and LLM qualitative evaluation
    for all candidates linked to the job, returning the ranked leaderboard.
    """
    screening_service = ScreeningService(db)
    result = await screening_service.screen_job_candidates(job_id)

    return APIResponse(
        message=f"Successfully screened and ranked {result.screened_candidates_count} candidates.",
        data=result,
    )


@router.get(
    "/jobs/{job_id}/rankings",
    response_model=APIResponse[JobScreeningResult],
)
def get_job_rankings(
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieves the ranked candidate leaderboard for a job.
    """
    job_repo = JobRepository(db)
    screening_repo = ScreeningRepository(db)

    job = job_repo.get_by_id(job_id)
    if not job:
        raise ResourceNotFoundException("Job", job_id)

    screenings = screening_repo.get_by_job_id(job_id)
    ranked_items = RankingService.rank_screenings(screenings)

    shortlisted_cnt = sum(1 for r in ranked_items if r.recommendation == "SHORTLIST")
    review_cnt = sum(1 for r in ranked_items if r.recommendation == "REVIEW")
    not_rec_cnt = sum(1 for r in ranked_items if r.recommendation == "NOT_RECOMMENDED")

    result = JobScreeningResult(
        job_id=job.id,
        job_title=job.title,
        company=job.company,
        total_candidates=len(job.resumes),
        screened_candidates_count=len(ranked_items),
        shortlisted_count=shortlisted_cnt,
        review_count=review_cnt,
        not_recommended_count=not_rec_cnt,
        rankings=ranked_items,
    )

    return APIResponse(message=f"Retrieved rankings for job {job_id}", data=result)


@router.get(
    "/screenings/{screening_id}",
    response_model=APIResponse[ScreeningResponse],
)
def get_screening_detail(
    screening_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieves comprehensive breakdown for an individual candidate screening.
    """
    screening_repo = ScreeningRepository(db)
    screening = screening_repo.get_by_id(screening_id)
    if not screening:
        raise ResourceNotFoundException("Screening", screening_id)

    cand = screening.candidate
    resume = cand.resume if cand else None

    response_data = ScreeningResponse(
        id=screening.id,
        job_id=screening.job_id,
        candidate_id=screening.candidate_id,
        overall_score=screening.overall_score,
        skill_score=screening.skill_score,
        experience_score=screening.experience_score,
        education_score=screening.education_score,
        certification_score=screening.certification_score,
        semantic_score=screening.semantic_score,
        recommendation=screening.recommendation,
        explanation=screening.explanation,
        strengths=screening.strengths or [],
        gaps=screening.gaps or [],
        llm_assessment=screening.llm_assessment or {},
        matched_skills=[
            MatchedSkillSchema(
                id=ms.id,
                skill=ms.skill,
                match_type=ms.match_type,
                similarity_score=ms.similarity_score,
            )
            for ms in screening.matched_skills
        ],
        missing_skills=[
            MissingSkillSchema(
                id=ms.id,
                skill=ms.skill,
                importance=ms.importance,
            )
            for ms in screening.missing_skills
        ],
        created_at=screening.created_at,
        candidate_name=cand.name if cand else "Unknown",
        candidate_email=cand.email if cand else None,
        resume_filename=resume.filename if resume else None,
    )

    return APIResponse(message="Screening detail retrieved successfully", data=response_data)
