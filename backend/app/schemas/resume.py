from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ResumeBase(BaseModel):
    filename: str
    job_id: int


class ResumeResponse(ResumeBase):
    id: int
    uploaded_at: datetime
    processing_status: str  # PENDING | PARSED | FAILED | SCREENED
    file_hash: str
    error_message: Optional[str] = None
    candidate_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class ResumeBatchUploadResponse(BaseModel):
    total_uploaded: int
    successful_resumes: List[ResumeResponse]
    failed_resumes: List[dict]
