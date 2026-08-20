from typing import List

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_llm_service
from app.core.exceptions import ResourceNotFoundException
from app.core.logging import logger
from app.core.security import compute_file_hash
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.job_repository import JobRepository
from app.repositories.resume_repository import ResumeRepository
from app.schemas.common import APIResponse
from app.schemas.resume import ResumeBatchUploadResponse, ResumeResponse
from app.services.llm_service import LLMService
from app.services.pdf_parser import PDFParser
from app.services.resume_parser import ResumeParserService
from app.services.storage_service import StorageService
from app.utils.file_validation import validate_resume_file

router = APIRouter(tags=["Resumes"])


@router.post(
    "/jobs/{job_id}/resumes",
    response_model=APIResponse[ResumeBatchUploadResponse],
    status_code=status.HTTP_201_CREATED,
)
async def upload_resumes(
    job_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    llm_service: LLMService = Depends(get_llm_service),
):
    """
    Accepts one or more PDF/TXT resume files, validates them, extracts content,
    creates structured candidate profiles, and links them to the job.
    """
    job_repo = JobRepository(db)
    resume_repo = ResumeRepository(db)
    candidate_repo = CandidateRepository(db)
    resume_parser = ResumeParserService(llm_service)

    job = job_repo.get_by_id(job_id)
    if not job:
        raise ResourceNotFoundException("Job", job_id)

    successful_resumes: List[ResumeResponse] = []
    failed_resumes: List[dict] = []

    for file in files:
        try:
            content = await file.read()
            filename = file.filename or "uploaded_resume.pdf"

            # 1. Validate file constraints
            validate_resume_file(filename, content)

            # 2. Check for duplicate upload via hash
            f_hash = compute_file_hash(content)
            existing = resume_repo.get_by_hash(job_id, f_hash)
            if existing:
                failed_resumes.append(
                    {
                        "filename": filename,
                        "reason": f"Duplicate resume already uploaded (ID: {existing.id})",
                    }
                )
                continue

            # 3. Store file on disk
            saved_path, clean_name = StorageService.save_upload_file(filename, content)

            # 4. Extract raw text from PDF
            raw_text, meta = PDFParser.extract_text_from_bytes(content, clean_name)

            # 5. Create Resume Record
            resume = resume_repo.create(
                job_id=job_id,
                filename=clean_name,
                raw_text=raw_text,
                file_hash=f_hash,
                file_path=saved_path,
            )

            # 6. Parse structured candidate profile
            try:
                parsed_out = await resume_parser.parse_resume_content(content, clean_name)
                cand_data = parsed_out["candidate_data"]
                cand_data["resume_id"] = resume.id
                candidate = candidate_repo.create(cand_data)
                resume_repo.update_status(resume.id, "PARSED")
                cand_id = candidate.id
            except Exception as parse_err:
                logger.warning(
                    f"Initial candidate parsing failed for resume {resume.id}: {parse_err}"
                )
                resume_repo.update_status(resume.id, "PENDING", error_message=str(parse_err))
                cand_id = None

            successful_resumes.append(
                ResumeResponse(
                    id=resume.id,
                    job_id=resume.job_id,
                    filename=resume.filename,
                    uploaded_at=resume.uploaded_at,
                    processing_status=resume.processing_status,
                    file_hash=resume.file_hash,
                    error_message=resume.error_message,
                    candidate_id=cand_id,
                )
            )

        except Exception as e:
            logger.error(f"Failed to process uploaded file '{file.filename}': {e}")
            failed_resumes.append({"filename": file.filename or "unknown", "reason": str(e)})

    result = ResumeBatchUploadResponse(
        total_uploaded=len(successful_resumes),
        successful_resumes=successful_resumes,
        failed_resumes=failed_resumes,
    )

    return APIResponse(
        message=f"Uploaded {len(successful_resumes)} resumes successfully ({len(failed_resumes)} failed)",
        data=result,
    )


@router.get("/jobs/{job_id}/resumes", response_model=APIResponse[List[ResumeResponse]])
def list_resumes_for_job(
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Lists all resumes uploaded for a specific job.
    """
    job_repo = JobRepository(db)
    resume_repo = ResumeRepository(db)

    job = job_repo.get_by_id(job_id)
    if not job:
        raise ResourceNotFoundException("Job", job_id)

    resumes = resume_repo.get_by_job_id(job_id)
    results = [
        ResumeResponse(
            id=r.id,
            job_id=r.job_id,
            filename=r.filename,
            uploaded_at=r.uploaded_at,
            processing_status=r.processing_status,
            file_hash=r.file_hash,
            error_message=r.error_message,
            candidate_id=r.candidate.id if r.candidate else None,
        )
        for r in resumes
    ]

    return APIResponse(message=f"Retrieved {len(results)} resumes", data=results)
