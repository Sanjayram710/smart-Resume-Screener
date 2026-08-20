from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.screening import Screening
from app.models.skill_match import MatchedSkill, MissingSkill


class ScreeningRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, screening_id: int) -> Optional[Screening]:
        return (
            self.db.query(Screening)
            .options(
                joinedload(Screening.candidate),
                joinedload(Screening.job),
                joinedload(Screening.matched_skills),
                joinedload(Screening.missing_skills)
            )
            .filter(Screening.id == screening_id)
            .first()
        )

    def get_by_candidate_and_job(self, candidate_id: int, job_id: int) -> Optional[Screening]:
        return (
            self.db.query(Screening)
            .options(
                joinedload(Screening.matched_skills),
                joinedload(Screening.missing_skills)
            )
            .filter(
                Screening.candidate_id == candidate_id,
                Screening.job_id == job_id
            )
            .first()
        )

    def get_by_job_id(self, job_id: int) -> List[Screening]:
        return (
            self.db.query(Screening)
            .options(
                joinedload(Screening.candidate),
                joinedload(Screening.matched_skills),
                joinedload(Screening.missing_skills)
            )
            .filter(Screening.job_id == job_id)
            .order_by(Screening.overall_score.desc())
            .all()
        )

    def create(
        self,
        screening_data: dict,
        matched_skills: List[dict],
        missing_skills: List[dict]
    ) -> Screening:
        # Check if screening already exists for candidate and job, if so replace/update
        existing = self.get_by_candidate_and_job(
            candidate_id=screening_data["candidate_id"],
            job_id=screening_data["job_id"]
        )
        if existing:
            self.db.delete(existing)
            self.db.flush()

        screening = Screening(**screening_data)
        self.db.add(screening)
        self.db.flush()

        for match in matched_skills:
            ms = MatchedSkill(
                screening_id=screening.id,
                skill=match["skill"],
                match_type=match["match_type"],
                similarity_score=match["similarity_score"]
            )
            self.db.add(ms)

        for missing in missing_skills:
            mss = MissingSkill(
                screening_id=screening.id,
                skill=missing["skill"],
                importance=missing["importance"]
            )
            self.db.add(mss)

        self.db.commit()
        self.db.refresh(screening)
        return screening

    def delete_by_job_id(self, job_id: int) -> int:
        count = self.db.query(Screening).filter(Screening.job_id == job_id).delete()
        self.db.commit()
        return count
