from typing import List
from app.models.screening import Screening
from app.schemas.screening import CandidateRankingItem


class RankingService:
    """
    Ranks screened candidates for a job in descending order of overall deterministic score,
    breaking ties deterministically via skill score and years of experience.
    """

    @classmethod
    def rank_screenings(cls, screenings: List[Screening]) -> List[CandidateRankingItem]:
        # Sort key: overall_score DESC, skill_score DESC, experience_score DESC
        sorted_screenings = sorted(
            screenings,
            key=lambda s: (s.overall_score, s.skill_score, s.experience_score),
            reverse=True
        )

        ranked_items: List[CandidateRankingItem] = []
        for index, s in enumerate(sorted_screenings, start=1):
            cand = s.candidate
            resume = cand.resume if cand else None

            matched_count = len(s.matched_skills) if s.matched_skills else 0
            missing_count = len(s.missing_skills) if s.missing_skills else 0
            top_skills = cand.skills[:6] if cand and cand.skills else []
            top_strengths = s.strengths[:3] if s.strengths else []

            explanation_snippet = (
                s.explanation[:160] + "..." if len(s.explanation or "") > 160 else (s.explanation or "")
            )

            ranked_items.append(
                CandidateRankingItem(
                    rank=index,
                    candidate_id=s.candidate_id,
                    screening_id=s.id,
                    candidate_name=cand.name if cand else "Unknown",
                    candidate_email=cand.email if cand else None,
                    resume_id=resume.id if resume else 0,
                    resume_filename=resume.filename if resume else "resume.pdf",
                    overall_score=s.overall_score,
                    skill_score=s.skill_score,
                    experience_score=s.experience_score,
                    education_score=s.education_score,
                    certification_score=s.certification_score,
                    semantic_score=s.semantic_score,
                    recommendation=s.recommendation,
                    years_of_experience=cand.years_of_experience if cand else 0.0,
                    matched_skills_count=matched_count,
                    missing_skills_count=missing_count,
                    top_skills=top_skills,
                    top_strengths=top_strengths,
                    explanation_snippet=explanation_snippet,
                )
            )

        return ranked_items
