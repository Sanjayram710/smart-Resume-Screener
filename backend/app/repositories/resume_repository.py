from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.resume import Resume


class ResumeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, resume_id: int) -> Optional[Resume]:
        return self.db.query(Resume).filter(Resume.id == resume_id).first()

    def get_by_hash(self, job_id: int, file_hash: str) -> Optional[Resume]:
        return self.db.query(Resume).filter(
            Resume.job_id == job_id,
            Resume.file_hash == file_hash
        ).first()

    def get_by_job_id(self, job_id: int) -> List[Resume]:
        return self.db.query(Resume).filter(Resume.job_id == job_id).order_by(Resume.uploaded_at.desc()).all()

    def create(self, job_id: int, filename: str, raw_text: str, file_hash: str, file_path: Optional[str] = None) -> Resume:
        resume = Resume(
            job_id=job_id,
            filename=filename,
            raw_text=raw_text,
            file_hash=file_hash,
            file_path=file_path,
            processing_status="PENDING"
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def update_status(self, resume_id: int, status: str, error_message: Optional[str] = None) -> Optional[Resume]:
        resume = self.get_by_id(resume_id)
        if not resume:
            return None
        resume.processing_status = status
        if error_message:
            resume.error_message = error_message
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def delete(self, resume_id: int) -> bool:
        resume = self.get_by_id(resume_id)
        if not resume:
            return False
        self.db.delete(resume)
        self.db.commit()
        return True
