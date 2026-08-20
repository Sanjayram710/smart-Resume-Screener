from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_llm_service
from app.core.exceptions import ResourceNotFoundException
from app.repositories.job_repository import JobRepository
from app.schemas.common import APIResponse
from app.schemas.job import JobCreate, JobResponse, JobSummary, JobUpdate
from app.services.job_parser import JobParserService
from app.services.llm_service import LLMService

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("", response_model=APIResponse[JobResponse], status_code=status.HTTP_201_CREATED)
async def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    llm_service: LLMService = Depends(get_llm_service),
):
    """
    Creates a new job posting.
    If auto_extract is enabled, parses skills and requirements from the job description.
    """
    job_repo = JobRepository(db)
    job_parser = JobParserService(llm_service)

    # Extract/normalize requirements
    structured_data = await job_parser.parse_and_structure_job(
        title=job_in.title,
        company=job_in.company,
        description=job_in.description,
        user_required_skills=job_in.required_skills,
        user_preferred_skills=job_in.preferred_skills,
        user_min_exp=job_in.minimum_experience,
        user_education=job_in.education_requirements,
        user_certifications=job_in.certifications,
        auto_extract=job_in.auto_extract,
    )

    job = job_repo.create(job_in, extra_data=structured_data)
    counts = job_repo.get_counts(job.id)

    response_data = JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        description=job.description,
        required_skills=job.required_skills or [],
        preferred_skills=job.preferred_skills or [],
        minimum_experience=job.minimum_experience,
        education_requirements=job.education_requirements or [],
        certifications=job.certifications or [],
        keywords=job.keywords or [],
        responsibilities=job.responsibilities or [],
        important_requirements=job.important_requirements or [],
        nice_to_have_requirements=job.nice_to_have_requirements or [],
        created_at=job.created_at,
        updated_at=job.updated_at,
        resume_count=counts["resume_count"],
        candidate_count=counts["candidate_count"],
        screened_count=counts["screened_count"],
    )

    return APIResponse(message="Job created successfully", data=response_data)


@router.get("", response_model=APIResponse[List[JobSummary]])
def list_jobs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """
    Lists all job postings with aggregate counts.
    """
    job_repo = JobRepository(db)
    jobs = job_repo.get_all(skip=skip, limit=limit)

    summaries = []
    for j in jobs:
        counts = job_repo.get_counts(j.id)
        summaries.append(
            JobSummary(
                id=j.id,
                title=j.title,
                company=j.company,
                required_skills=j.required_skills or [],
                preferred_skills=j.preferred_skills or [],
                minimum_experience=j.minimum_experience,
                resume_count=counts["resume_count"],
                screened_count=counts["screened_count"],
                created_at=j.created_at,
            )
        )

    return APIResponse(message=f"Retrieved {len(summaries)} jobs", data=summaries)


@router.get("/{job_id}", response_model=APIResponse[JobResponse])
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieves detailed job posting information.
    """
    job_repo = JobRepository(db)
    job = job_repo.get_by_id(job_id)
    if not job:
        raise ResourceNotFoundException("Job", job_id)

    counts = job_repo.get_counts(job.id)
    response_data = JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        description=job.description,
        required_skills=job.required_skills or [],
        preferred_skills=job.preferred_skills or [],
        minimum_experience=job.minimum_experience,
        education_requirements=job.education_requirements or [],
        certifications=job.certifications or [],
        keywords=job.keywords or [],
        responsibilities=job.responsibilities or [],
        important_requirements=job.important_requirements or [],
        nice_to_have_requirements=job.nice_to_have_requirements or [],
        created_at=job.created_at,
        updated_at=job.updated_at,
        resume_count=counts["resume_count"],
        candidate_count=counts["candidate_count"],
        screened_count=counts["screened_count"],
    )

    return APIResponse(message="Job retrieved successfully", data=response_data)


@router.put("/{job_id}", response_model=APIResponse[JobResponse])
def update_job(
    job_id: int,
    job_in: JobUpdate,
    db: Session = Depends(get_db),
):
    """
    Updates an existing job posting.
    """
    job_repo = JobRepository(db)
    job = job_repo.update(job_id, job_in)
    if not job:
        raise ResourceNotFoundException("Job", job_id)

    counts = job_repo.get_counts(job.id)
    response_data = JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        description=job.description,
        required_skills=job.required_skills or [],
        preferred_skills=job.preferred_skills or [],
        minimum_experience=job.minimum_experience,
        education_requirements=job.education_requirements or [],
        certifications=job.certifications or [],
        keywords=job.keywords or [],
        responsibilities=job.responsibilities or [],
        important_requirements=job.important_requirements or [],
        nice_to_have_requirements=job.nice_to_have_requirements or [],
        created_at=job.created_at,
        updated_at=job.updated_at,
        resume_count=counts["resume_count"],
        candidate_count=counts["candidate_count"],
        screened_count=counts["screened_count"],
    )

    return APIResponse(message="Job updated successfully", data=response_data)


@router.delete("/{job_id}", response_model=APIResponse[dict])
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Deletes a job posting and all associated resumes, candidates, and screenings.
    """
    job_repo = JobRepository(db)
    success = job_repo.delete(job_id)
    if not success:
        raise ResourceNotFoundException("Job", job_id)
    return APIResponse(message=f"Job {job_id} deleted successfully", data={"id": job_id})
