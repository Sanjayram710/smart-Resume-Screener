from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.core.logging import logger
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.job_repository import JobRepository
from app.repositories.resume_repository import ResumeRepository
from app.repositories.screening_repository import ScreeningRepository
from app.schemas.screening import JobScreeningResult
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.matching_service import MatchingService
from app.services.ranking_service import RankingService
from app.services.resume_parser import ResumeParserService
from app.services.scoring_service import ScoringService


class ScreeningService:
    """
    Orchestrates candidate-job screening, deterministic multi-stage matching,
    qualitative LLM evaluation, and ranked shortlisting.
    """

    def __init__(self, db: Session):
        self.db = db
        self.job_repo = JobRepository(db)
        self.resume_repo = ResumeRepository(db)
        self.candidate_repo = CandidateRepository(db)
        self.screening_repo = ScreeningRepository(db)
        self.llm_service = LLMService()
        self.resume_parser = ResumeParserService(self.llm_service)

    async def screen_job_candidates(self, job_id: int) -> JobScreeningResult:
        job = self.job_repo.get_by_id(job_id)
        if not job:
            raise ResourceNotFoundException("Job", job_id)

        # 1. Fetch resumes for this job
        resumes = self.resume_repo.get_by_job_id(job_id)
        if not resumes:
            logger.info(f"No resumes found for job ID {job_id}.")
            return JobScreeningResult(
                job_id=job.id,
                job_title=job.title,
                company=job.company,
                total_candidates=0,
                screened_candidates_count=0,
                shortlisted_count=0,
                review_count=0,
                not_recommended_count=0,
                rankings=[],
            )

        # Generate Job embedding vector for semantic comparison
        job_summary = (
            f"Job: {job.title} at {job.company}\n"
            f"Requirements: {', '.join(job.required_skills or [])}\n"
            f"Preferred: {', '.join(job.preferred_skills or [])}\n"
            f"Experience: {job.minimum_experience} years\n"
            f"{job.description[:1000]}"
        )
        job_vector = await EmbeddingService.get_embedding(job_summary)

        # 2. Process each resume
        for resume in resumes:
            try:
                candidate = resume.candidate
                # If resume hasn't been parsed into candidate profile yet, parse it now
                if not candidate:
                    parsed_out = await self.resume_parser.parse_resume_content(
                        file_bytes=resume.raw_text.encode("utf-8"),
                        filename=resume.filename,
                    )
                    cand_data = parsed_out["candidate_data"]
                    cand_data["resume_id"] = resume.id
                    candidate = self.candidate_repo.create(cand_data)
                    self.resume_repo.update_status(resume.id, "PARSED")

                # Ensure candidate has embedding
                cand_vec = candidate.embedding_vector
                if not cand_vec:
                    cand_summary = (
                        f"{candidate.name} {candidate.summary} {' '.join(candidate.skills or [])}"
                    )
                    cand_vec = await EmbeddingService.get_embedding(cand_summary)
                    self.candidate_repo.update(candidate.id, {"embedding_vector": cand_vec})

                # 3. Stage 1 & 2: Skill Matching
                skill_match_res = MatchingService.match_skills(
                    candidate_skills=candidate.skills or [],
                    required_skills=job.required_skills or [],
                    preferred_skills=job.preferred_skills or [],
                )
                skill_score = skill_match_res["skill_score"]
                matched_skills = skill_match_res["matched_skills"]
                missing_skills = skill_match_res["missing_skills"]

                # 4. Stage 3: Experience Matching
                experience_score = MatchingService.match_experience(
                    candidate_years=candidate.years_of_experience or 0.0,
                    minimum_experience=job.minimum_experience or 0.0,
                )

                # 5. Stage 4: Education Matching
                education_score = MatchingService.match_education(
                    candidate_education=candidate.education or [],
                    education_requirements=job.education_requirements or [],
                )

                # 6. Stage 5: Certification Matching
                certification_score = MatchingService.match_certifications(
                    candidate_certs=candidate.certifications or [],
                    required_certs=job.certifications or [],
                )

                # 7. Semantic Vector Matching
                semantic_score = MatchingService.match_semantic_relevance(
                    candidate_vector=cand_vec,
                    job_vector=job_vector,
                )

                # 8. Deterministic Scoring Engine (Calculates 1.0 - 10.0 scale and recommendation)
                overall_score, total_pct, recommendation = ScoringService.calculate_overall_score(
                    skill_score=skill_score,
                    experience_score=experience_score,
                    semantic_score=semantic_score,
                    education_score=education_score,
                    certification_score=certification_score,
                )

                # 9. Stage 6: Qualitative LLM Evaluation (strengths, gaps, explanation)
                job_context = {
                    "title": job.title,
                    "company": job.company,
                    "required_skills": job.required_skills or [],
                    "preferred_skills": job.preferred_skills or [],
                    "minimum_experience": job.minimum_experience or 0.0,
                    "education_requirements": job.education_requirements or [],
                    "responsibilities": job.responsibilities or [],
                }
                cand_context = {
                    "name": candidate.name,
                    "summary": candidate.summary or "",
                    "years_of_experience": candidate.years_of_experience or 0.0,
                    "skills": candidate.skills or [],
                    "experience": candidate.experience or [],
                    "education": candidate.education or [],
                    "certifications": candidate.certifications or [],
                    "projects": candidate.projects or [],
                }

                llm_eval = await self.llm_service.evaluate_candidate(cand_context, job_context)

                # 10. Persist Screening Record
                screening_data = {
                    "job_id": job.id,
                    "candidate_id": candidate.id,
                    "overall_score": overall_score,
                    "skill_score": skill_score,
                    "experience_score": experience_score,
                    "education_score": education_score,
                    "certification_score": certification_score,
                    "semantic_score": semantic_score,
                    "recommendation": recommendation,  # Deterministic rule-based recommendation
                    "explanation": llm_eval.justification or llm_eval.overall_assessment,
                    "strengths": llm_eval.strengths or [],
                    "gaps": llm_eval.missing_skills or [],
                    "llm_assessment": llm_eval.model_dump(),
                }

                self.screening_repo.create(
                    screening_data=screening_data,
                    matched_skills=matched_skills,
                    missing_skills=missing_skills,
                )

                self.resume_repo.update_status(resume.id, "SCREENED")

            except Exception as e:
                logger.error(
                    f"Error screening resume {resume.id} ('{resume.filename}'): {e}", exc_info=True
                )
                self.resume_repo.update_status(resume.id, "FAILED", error_message=str(e))

        # 11. Retrieve all screenings and rank
        all_screenings = self.screening_repo.get_by_job_id(job_id)
        ranked_items = RankingService.rank_screenings(all_screenings)

        # Count classifications
        shortlisted_cnt = sum(1 for r in ranked_items if r.recommendation == "SHORTLIST")
        review_cnt = sum(1 for r in ranked_items if r.recommendation == "REVIEW")
        not_rec_cnt = sum(1 for r in ranked_items if r.recommendation == "NOT_RECOMMENDED")

        return JobScreeningResult(
            job_id=job.id,
            job_title=job.title,
            company=job.company,
            total_candidates=len(resumes),
            screened_candidates_count=len(ranked_items),
            shortlisted_count=shortlisted_cnt,
            review_count=review_cnt,
            not_recommended_count=not_rec_cnt,
            rankings=ranked_items,
        )
