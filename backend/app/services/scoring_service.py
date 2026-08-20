from typing import Any, Dict, Tuple
from app.core.config import settings
from app.core.logging import logger


class ScoringService:
    """
    Computes deterministic candidate match scores and applies shortlisting rules.
    Does NOT depend on LLMs for numeric scores.
    """

    @classmethod
    def calculate_overall_score(
        cls,
        skill_score: float,
        experience_score: float,
        semantic_score: float,
        education_score: float,
        certification_score: float,
    ) -> Tuple[float, float, str]:
        """
        Calculates the weighted total percentage (0 - 100) and converts it to a 1.0 - 10.0 scale,
        then evaluates the shortlisting recommendation.

        Returns:
            Tuple of (overall_score_1_to_10, total_percentage_0_to_100, recommendation)
        """
        w_skill = settings.SCORE_WEIGHT_SKILLS
        w_exp = settings.SCORE_WEIGHT_EXPERIENCE
        w_sem = settings.SCORE_WEIGHT_SEMANTIC
        w_edu = settings.SCORE_WEIGHT_EDUCATION
        w_cert = settings.SCORE_WEIGHT_CERTIFICATIONS

        # Weighted sum of subscores (0 - 100)
        total_percentage = (
            (skill_score * w_skill) +
            (experience_score * w_exp) +
            (semantic_score * w_sem) +
            (education_score * w_edu) +
            (certification_score * w_cert)
        )

        total_percentage = min(100.0, max(0.0, total_percentage))

        # Convert to 1.0 to 10.0 scale: 100% -> 10.0, 75% -> 7.5, 0% -> 1.0
        score_1_to_10 = max(1.0, min(10.0, round(total_percentage / 10.0, 1)))

        # Determine recommendation based on configurable thresholds
        if score_1_to_10 >= settings.SHORTLIST_THRESHOLD:
            recommendation = "SHORTLIST"
        elif score_1_to_10 >= settings.REVIEW_THRESHOLD:
            recommendation = "REVIEW"
        else:
            recommendation = "NOT_RECOMMENDED"

        return score_1_to_10, round(total_percentage, 2), recommendation

    @classmethod
    def get_score_breakdown_dict(
        cls,
        skill_score: float,
        experience_score: float,
        semantic_score: float,
        education_score: float,
        certification_score: float,
    ) -> Dict[str, Any]:
        overall_score, total_pct, recommendation = cls.calculate_overall_score(
            skill_score=skill_score,
            experience_score=experience_score,
            semantic_score=semantic_score,
            education_score=education_score,
            certification_score=certification_score,
        )

        return {
            "overall_score": overall_score,
            "total_percentage": total_pct,
            "recommendation": recommendation,
            "weights": {
                "skill": settings.SCORE_WEIGHT_SKILLS,
                "experience": settings.SCORE_WEIGHT_EXPERIENCE,
                "semantic": settings.SCORE_WEIGHT_SEMANTIC,
                "education": settings.SCORE_WEIGHT_EDUCATION,
                "certification": settings.SCORE_WEIGHT_CERTIFICATIONS,
            },
            "subscores": {
                "skill_score": round(skill_score, 1),
                "experience_score": round(experience_score, 1),
                "semantic_score": round(semantic_score, 1),
                "education_score": round(education_score, 1),
                "certification_score": round(certification_score, 1),
            }
        }
