from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_llm_service
from app.core.exceptions import ResourceNotFoundException
from app.core.logging import logger
from app.core.security import compute_file_hash
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.job_repository import JobRepository
from app.repositories.resume_repository import ResumeRepository
from app.repositories.screening_repository import ScreeningRepository
from app.schemas.common import APIResponse
from app.schemas.job import JobCreate
from app.schemas.screening import (
    JobScreeningResult,
    MatchedSkillSchema,
    MissingSkillSchema,
    ScreeningResponse,
)
from app.services.job_parser import JobParserService
from app.services.llm_service import LLMService
from app.services.pdf_parser import PDFParser
from app.services.ranking_service import RankingService
from app.services.resume_parser import ResumeParserService
from app.services.screening_service import ScreeningService
from app.services.storage_service import StorageService
from app.utils.file_validation import validate_resume_file

router = APIRouter(tags=["Screening & Rankings"])


@router.post(
    "/jobs/quick-match",
    response_model=APIResponse[JobScreeningResult],
    status_code=status.HTTP_200_OK,
)
async def quick_match_jd_and_resumes(
    jd_file: Optional[UploadFile] = File(None),
    job_id: Optional[int] = Form(None),
    resumes: List[UploadFile] = File(...),
    title: Optional[str] = Form(None),
    company: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    llm_service: LLMService = Depends(get_llm_service),
):
    """
    Instant Screener: Accepts a JD PDF/TXT (or existing job_id) AND candidate resume PDFs,
    processes both on-the-fly, runs multi-stage deterministic & semantic matching,
    and returns ranked match scores with skill gap analysis.
    """
    job_repo = JobRepository(db)
    resume_repo = ResumeRepository(db)
    candidate_repo = CandidateRepository(db)
    job_parser = JobParserService(llm_service)
    resume_parser = ResumeParserService(llm_service)

    # 1. Determine or create Job
    if job_id:
        job = job_repo.get_by_id(job_id)
        if not job:
            raise ResourceNotFoundException("Job", job_id)
    else:
        if not jd_file:
            raise ResourceNotFoundException("Job Description File", "Missing required jd_file or job_id")
        jd_content = await jd_file.read()
        jd_name = jd_file.filename or "job_description.pdf"
        validate_resume_file(jd_name, jd_content)

        parsed_jd = await job_parser.parse_jd_file_content(
            file_bytes=jd_content,
            filename=jd_name,
            title_override=title or "",
            company_override=company or "",
        )

        job_create = JobCreate(
            title=parsed_jd["title"],
            company=parsed_jd["company"],
            description=parsed_jd["description"],
            required_skills=parsed_jd["required_skills"],
            preferred_skills=parsed_jd["preferred_skills"],
            minimum_experience=parsed_jd["minimum_experience"],
            education_requirements=parsed_jd["education_requirements"],
            certifications=parsed_jd["certifications"],
            auto_extract=True,
        )

        structured_data = await job_parser.parse_and_structure_job(
            title=job_create.title,
            company=job_create.company,
            description=job_create.description,
            user_required_skills=job_create.required_skills,
            user_preferred_skills=job_create.preferred_skills,
            user_min_exp=job_create.minimum_experience,
            user_education=job_create.education_requirements,
            user_certifications=job_create.certifications,
            auto_extract=False,
        )
        job = job_repo.create(job_create, extra_data=structured_data)

    # 2. Upload and process Resumes for this Job
    for file in resumes:
        try:
            content = await file.read()
            filename = file.filename or "candidate_resume.pdf"
            validate_resume_file(filename, content)

            f_hash = compute_file_hash(content)
            existing = resume_repo.get_by_hash(job.id, f_hash)
            if existing:
                continue

            saved_path, clean_name = StorageService.save_upload_file(filename, content)
            raw_text, meta = PDFParser.extract_text_from_bytes(content, clean_name)

            resume = resume_repo.create(
                job_id=job.id,
                filename=clean_name,
                raw_text=raw_text,
                file_hash=f_hash,
                file_path=saved_path,
            )

            try:
                parsed_out = await resume_parser.parse_resume_content(content, clean_name)
                cand_data = parsed_out["candidate_data"]
                cand_data["resume_id"] = resume.id
                candidate = candidate_repo.create(cand_data)
                resume_repo.update_status(resume.id, "PARSED")
            except Exception as parse_err:
                logger.warning(f"Candidate parsing failed for resume {resume.id}: {parse_err}")
                resume_repo.update_status(resume.id, "PENDING", error_message=str(parse_err))

        except Exception as e:
            logger.error(f"Failed to process file '{file.filename}': {e}")

    # 3. Screen and Rank
    screening_service = ScreeningService(db)
    result = await screening_service.screen_job_candidates(job.id)

    return APIResponse(
        message=f"Screened and ranked {result.screened_candidates_count} resumes for '{job.title}'",
        data=result,
    )



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
