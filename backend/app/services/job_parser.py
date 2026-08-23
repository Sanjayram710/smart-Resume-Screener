from typing import Any, Dict, List

from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.skill_normalizer import SkillNormalizer
from app.services.text_cleaner import TextCleaner


class JobParserService:
    """
    Parses and structures Job requirements using LLM extraction and canonical normalization.
    """

    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service

    async def parse_and_structure_job(
        self,
        title: str,
        company: str,
        description: str,
        user_required_skills: List[str],
        user_preferred_skills: List[str],
        user_min_exp: float,
        user_education: List[str],
        user_certifications: List[str],
        auto_extract: bool = True,
    ) -> Dict[str, Any]:
        cleaned_desc = TextCleaner.clean_text(description)

        # Normalize any skills explicitly passed by user
        req_skills = SkillNormalizer.normalize_list(user_required_skills)
        pref_skills = SkillNormalizer.normalize_list(user_preferred_skills)
        min_exp = user_min_exp
        education = user_education
        certifications = user_certifications
        keywords = []
        responsibilities = []
        important_reqs = []
        nice_to_haves = []

        # If user did not provide required skills, or if auto_extract is requested, run LLM job extraction
        if auto_extract or not req_skills:
            extracted = await self.llm_service.extract_job(
                job_title=title, company=company, description=cleaned_desc
            )

            # Merge / augment requirements
            extracted_req = SkillNormalizer.normalize_list(extracted.required_skills)
            extracted_pref = SkillNormalizer.normalize_list(extracted.preferred_skills)

            req_skills = SkillNormalizer.normalize_list(req_skills + extracted_req)
            pref_skills = SkillNormalizer.normalize_list(pref_skills + extracted_pref)

            if min_exp == 0.0 and extracted.minimum_experience > 0:
                min_exp = extracted.minimum_experience

            if not education and extracted.education_requirements:
                education = extracted.education_requirements

            if not certifications and extracted.certifications:
                certifications = extracted.certifications

            keywords = extracted.keywords
            responsibilities = extracted.responsibilities
            important_reqs = extracted.important_requirements
            nice_to_haves = extracted.nice_to_have_requirements

        # Generate Job embedding vector
        job_summary = (
            f"Job Title: {title} at {company}\n"
            f"Required Skills: {', '.join(req_skills)}\n"
            f"Preferred Skills: {', '.join(pref_skills)}\n"
            f"Min Experience: {min_exp} years\n"
            f"Description: {cleaned_desc[:1000]}"
        )
        job_vector = await EmbeddingService.get_embedding(job_summary)

        return {
            "required_skills": req_skills,
            "preferred_skills": pref_skills,
            "minimum_experience": min_exp,
            "education_requirements": education,
            "certifications": certifications,
            "keywords": keywords,
            "responsibilities": responsibilities,
            "important_requirements": important_reqs,
            "nice_to_have_requirements": nice_to_haves,
            "job_vector": job_vector,
        }

    async def parse_jd_file_content(
        self,
        file_bytes: bytes,
        filename: str,
        title_override: str = "",
        company_override: str = "",
    ) -> Dict[str, Any]:
        """
        Extracts text from a JD document (PDF or TXT), extracts structured
        role requirements via LLM, and normalizes skills and criteria.
        """
        from app.services.pdf_parser import PDFParser

        raw_text, meta = PDFParser.extract_text_from_bytes(file_bytes, filename)
        cleaned_text = TextCleaner.clean_text(raw_text)

        extracted = await self.llm_service.extract_job(
            job_title=title_override,
            company=company_override,
            description=cleaned_text,
        )

        req_skills = SkillNormalizer.normalize_list(extracted.required_skills)
        pref_skills = SkillNormalizer.normalize_list(extracted.preferred_skills)

        return {
            "title": extracted.job_title or title_override or "Software Engineer",
            "company": extracted.company or company_override or "Hiring Organization",
            "description": cleaned_text,
            "required_skills": req_skills,
            "preferred_skills": pref_skills,
            "minimum_experience": extracted.minimum_experience,
            "education_requirements": extracted.education_requirements,
            "certifications": extracted.certifications,
            "responsibilities": extracted.responsibilities,
            "keywords": extracted.keywords,
            "important_requirements": extracted.important_requirements,
            "nice_to_have_requirements": extracted.nice_to_have_requirements,
            "raw_text": raw_text,
            "filename": filename,
            "char_count": meta.get("char_count", len(raw_text)),
            "page_count": meta.get("pages", 1),
        }

