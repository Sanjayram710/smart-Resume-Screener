# Import all models here so that Alembic and Base.metadata have access to them
from app.db.database import Base
from app.models.candidate import Candidate
from app.models.job import Job
from app.models.resume import Resume
from app.models.screening import Screening
from app.models.skill_match import MatchedSkill, MissingSkill

__all__ = [
    "Base",
    "Job",
    "Resume",
    "Candidate",
    "Screening",
    "MatchedSkill",
    "MissingSkill",
]
