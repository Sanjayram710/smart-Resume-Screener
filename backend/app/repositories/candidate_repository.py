from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.candidate import Candidate
from app.models.resume import Resume


class CandidateRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, candidate_id: int) -> Optional[Candidate]:
        return self.db.query(Candidate).filter(Candidate.id == candidate_id).first()

    def get_by_resume_id(self, resume_id: int) -> Optional[Candidate]:
        return self.db.query(Candidate).filter(Candidate.resume_id == resume_id).first()

    def get_by_job_id(self, job_id: int) -> List[Candidate]:
        return (
            self.db.query(Candidate)
            .join(Resume, Resume.id == Candidate.resume_id)
            .filter(Resume.job_id == job_id)
            .order_by(Candidate.created_at.desc())
            .all()
        )

    def create(self, candidate_data: dict) -> Candidate:
        candidate = Candidate(**candidate_data)
        self.db.add(candidate)
        self.db.commit()
        self.db.refresh(candidate)
        return candidate

    def update(self, candidate_id: int, update_data: dict) -> Optional[Candidate]:
        candidate = self.get_by_id(candidate_id)
        if not candidate:
            return None
        for key, value in update_data.items():
            setattr(candidate, key, value)
        self.db.commit()
        self.db.refresh(candidate)
        return candidate

    def delete(self, candidate_id: int) -> bool:
        candidate = self.get_by_id(candidate_id)
        if not candidate:
            return False
        self.db.delete(candidate)
        self.db.commit()
        return True
