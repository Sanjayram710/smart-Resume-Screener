from typing import Any, Dict, List

from app.services.embedding_service import EmbeddingService
from app.services.skill_normalizer import SkillNormalizer


class MatchingService:
    """
    Executes the multi-stage matching algorithm between Candidate profiles and Job requirements.
    Does NOT use LLMs for numeric scores; computes exact, semantic, experience, education,
    and certification sub-scores deterministically.
    """

    @classmethod
    def match_skills(
        cls, candidate_skills: List[str], required_skills: List[str], preferred_skills: List[str]
    ) -> Dict[str, Any]:
        """
        Stage 1 & 2: Exact and Semantic Skill Matching.
        Matches candidate skills against required and preferred job skills.
        """
        norm_candidate_skills = SkillNormalizer.normalize_list(candidate_skills)
        norm_required_skills = SkillNormalizer.normalize_list(required_skills)
        norm_preferred_skills = SkillNormalizer.normalize_list(preferred_skills)

        matched_skills_records: List[Dict[str, Any]] = []
        missing_skills_records: List[Dict[str, Any]] = []

        # 1. Match Required Skills (Weight: 75% of skill score)
        req_score_accum = 0.0
        for req_skill in norm_required_skills:
            best_sim = 0.0
            best_type = "NONE"

            for cand_skill in norm_candidate_skills:
                sim, match_type = SkillNormalizer.compare_skills(cand_skill, req_skill)
                if sim > best_sim:
                    best_sim = sim
                    best_type = match_type

            if best_sim >= 0.7:  # Match threshold
                req_score_accum += best_sim
                matched_skills_records.append(
                    {
                        "skill": req_skill,
                        "match_type": best_type,
                        "similarity_score": round(best_sim, 2),
                        "importance": "REQUIRED",
                    }
                )
            else:
                missing_skills_records.append({"skill": req_skill, "importance": "REQUIRED"})

        req_coverage = (
            req_score_accum / max(len(norm_required_skills), 1) if norm_required_skills else 1.0
        )

        # 2. Match Preferred Skills (Weight: 25% of skill score)
        pref_score_accum = 0.0
        for pref_skill in norm_preferred_skills:
            best_sim = 0.0
            best_type = "NONE"

            for cand_skill in norm_candidate_skills:
                sim, match_type = SkillNormalizer.compare_skills(cand_skill, pref_skill)
                if sim > best_sim:
                    best_sim = sim
                    best_type = match_type

            if best_sim >= 0.7:
                pref_score_accum += best_sim
                matched_skills_records.append(
                    {
                        "skill": pref_skill,
                        "match_type": best_type,
                        "similarity_score": round(best_sim, 2),
                        "importance": "PREFERRED",
                    }
                )
            else:
                missing_skills_records.append({"skill": pref_skill, "importance": "PREFERRED"})

        pref_coverage = (
            pref_score_accum / max(len(norm_preferred_skills), 1) if norm_preferred_skills else 1.0
        )

        # Overall Skill Match Percentage (0 - 100)
        # If no preferred skills are listed, required skills account for 100%
        if not norm_preferred_skills:
            skill_score = req_coverage * 100.0
        else:
            skill_score = (0.75 * req_coverage + 0.25 * pref_coverage) * 100.0

        return {
            "skill_score": round(min(100.0, max(0.0, skill_score)), 2),
            "matched_skills": matched_skills_records,
            "missing_skills": missing_skills_records,
            "required_coverage": round(req_coverage * 100, 2),
            "preferred_coverage": round(pref_coverage * 100, 2),
        }

    @classmethod
    def match_experience(cls, candidate_years: float, minimum_experience: float) -> float:
        """
        Stage 3: Experience Matching.
        Computes experience score (0 - 100) comparing verified years against requirement.
        """
        if minimum_experience <= 0:
            return 100.0

        ratio = candidate_years / minimum_experience
        if ratio >= 1.0:
            # Exceeding experience gives up to 100% with mild bonus cap
            score = 100.0
        else:
            # Proportional linear scaling for lower experience (e.g. 2 yrs / 4 yrs = 50%)
            score = ratio * 100.0

        return round(min(100.0, max(0.0, score)), 2)

    @classmethod
    def match_education(
        cls, candidate_education: List[Dict[str, Any]], education_requirements: List[str]
    ) -> float:
        """
        Stage 4: Education Matching.
        Evaluates candidate degree level against required level.
        Hierarchy: PhD (100) > Master's (90) > Bachelor's (80) > Associate/Diploma (60) > Other (40).
        """
        if not education_requirements:
            return 100.0

        degree_rank = {
            "phd": 5,
            "doctorate": 5,
            "ph.d": 5,
            "master": 4,
            "m.s": 4,
            "ms": 4,
            "m.tech": 4,
            "mba": 4,
            "bachelor": 3,
            "b.s": 3,
            "bs": 3,
            "b.e": 3,
            "b.tech": 3,
            "ba": 3,
            "b.a": 3,
            "associate": 2,
            "diploma": 2,
        }

        # Find highest candidate degree rank
        highest_cand_rank = 1
        cand_edu_text = " ".join(
            [
                str(e.get("degree", "")) + " " + str(e.get("field_of_study", ""))
                for e in candidate_education
            ]
        ).lower()
        for key, rank in degree_rank.items():
            if key in cand_edu_text and rank > highest_cand_rank:
                highest_cand_rank = rank

        # Find target required rank
        req_edu_text = " ".join(education_requirements).lower()
        target_req_rank = 3  # Default Bachelor's
        for key, rank in degree_rank.items():
            if key in req_edu_text and rank > target_req_rank:
                target_req_rank = rank

        if highest_cand_rank >= target_req_rank:
            score = 100.0
        elif highest_cand_rank == target_req_rank - 1:
            score = 75.0
        else:
            score = 50.0

        return round(score, 2)

    @classmethod
    def match_certifications(cls, candidate_certs: List[str], required_certs: List[str]) -> float:
        """
        Stage 5: Certification Matching.
        Checks for certifications if requested in job posting, or grants baseline for certified candidates.
        """
        if not required_certs:
            # If no certifications explicitly requested, grant full or baseline bonus
            return 100.0 if candidate_certs else 80.0

        cand_certs_clean = [c.lower() for c in candidate_certs]
        matched_count = 0
        for req in required_certs:
            req_l = req.lower()
            if any(req_l in c or c in req_l for c in cand_certs_clean):
                matched_count += 1

        score = (matched_count / max(len(required_certs), 1)) * 100.0
        return round(min(100.0, max(0.0, score)), 2)

    @classmethod
    def match_semantic_relevance(
        cls, candidate_vector: List[float], job_vector: List[float]
    ) -> float:
        """
        Computes cosine similarity between Candidate embedding and Job embedding vector.
        """
        if not candidate_vector or not job_vector:
            return 70.0  # Sensible default if vectors not available

        sim = EmbeddingService.cosine_similarity(candidate_vector, job_vector)
        return round(sim * 100.0, 2)
