from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.resume import Resume
from app.models.screening import Screening
from app.schemas.job import JobCreate, JobUpdate


class JobRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, job_id: int) -> Optional[Job]:
        return self.db.query(Job).filter(Job.id == job_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Job]:
        return self.db.query(Job).order_by(Job.created_at.desc()).offset(skip).limit(limit).all()

    def create(self, job_in: JobCreate, extra_data: Optional[dict] = None) -> Job:
        data = job_in.model_dump(exclude={"auto_extract"})
        if extra_data:
            data.update(extra_data)

        # Only pass columns that exist on the Job model
        valid_columns = {c.name for c in Job.__table__.columns}
        filtered_data = {k: v for k, v in data.items() if k in valid_columns}

        job = Job(**filtered_data)
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job

    def update(self, job_id: int, job_in: JobUpdate) -> Optional[Job]:
        job = self.get_by_id(job_id)
        if not job:
            return None

        update_data = job_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(job, field, value)

        self.db.commit()
        self.db.refresh(job)
        return job

    def delete(self, job_id: int) -> bool:
        job = self.get_by_id(job_id)
        if not job:
            return False
        self.db.delete(job)
        self.db.commit()
        return True

    def get_counts(self, job_id: int) -> dict:
        resume_count = self.db.query(Resume).filter(Resume.job_id == job_id).count()
        screened_count = self.db.query(Screening).filter(Screening.job_id == job_id).count()
        return {
            "resume_count": resume_count,
            "candidate_count": resume_count,
            "screened_count": screened_count,
        }
