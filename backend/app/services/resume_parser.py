from typing import Any, Dict
from app.core.logging import logger
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.pdf_parser import PDFParser
from app.services.skill_normalizer import SkillNormalizer
from app.services.text_cleaner import TextCleaner


class ResumeParserService:
    """
    Orchestrates the Resume Processing Pipeline:
    PDF Extraction -> Text Cleaning -> Section Segmentation -> LLM Structured Extraction -> Embeddings.
    """

    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service

    async def parse_resume_content(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        # 1. PDF text extraction
        raw_text, meta = PDFParser.extract_text_from_bytes(file_bytes, filename)

        # 2. Text cleaning and segmentation
        cleaned_text = TextCleaner.clean_text(raw_text)

        # 3. LLM structured extraction
        extracted = await self.llm_service.extract_resume(cleaned_text)

        # 4. Normalize extracted skills
        all_skills = SkillNormalizer.normalize_list(extracted.skills + extracted.explicit_skills)
        tech_skills = SkillNormalizer.normalize_list(extracted.technical_skills)

        # 5. Generate embedding vector from candidate summary + skills + experience
        profile_summary = (
            f"Candidate: {extracted.name}\n"
            f"Summary: {extracted.summary}\n"
            f"Skills: {', '.join(all_skills)}\n"
            f"Experience: {extracted.years_of_experience} years\n"
        )
        embedding_vec = await EmbeddingService.get_embedding(profile_summary)

        # Return structured candidate dictionary
        candidate_dict = {
            "name": extracted.name or "Anonymous Candidate",
            "email": extracted.email,
            "phone": extracted.phone,
            "summary": extracted.summary,
            "skills": all_skills,
            "technical_skills": tech_skills,
            "soft_skills": extracted.soft_skills,
            "education": [e.model_dump() for e in extracted.education],
            "experience": [e.model_dump() for e in extracted.work_experience],
            "certifications": extracted.certifications,
            "projects": [p.model_dump() for p in extracted.projects],
            "years_of_experience": float(extracted.years_of_experience or 0.0),
            "embedding_vector": embedding_vec,
            "extraction_warnings": extracted.extraction_warnings,
        }

        return {
            "raw_text": raw_text,
            "cleaned_text": cleaned_text,
            "candidate_data": candidate_dict,
            "metadata": meta,
        }
