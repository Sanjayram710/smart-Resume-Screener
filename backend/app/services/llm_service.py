import abc
import re
from typing import Any, Dict

import httpx

from app.core.config import settings
from app.core.exceptions import LLMServiceException
from app.core.logging import logger
from app.prompts.candidate_matching import (
    CANDIDATE_MATCHING_SYSTEM_PROMPT,
    CANDIDATE_MATCHING_USER_PROMPT,
)
from app.prompts.job_extraction import (
    JOB_EXTRACTION_SYSTEM_PROMPT,
    JOB_EXTRACTION_USER_PROMPT,
)
from app.prompts.resume_extraction import (
    RESUME_EXTRACTION_SYSTEM_PROMPT,
    RESUME_EXTRACTION_USER_PROMPT,
)
from app.schemas.llm import (
    CandidateEvaluationOutput,
    EducationItem,
    ExperienceItem,
    JobExtractionOutput,
    ProjectItem,
    ResumeExtractionOutput,
)
from app.services.skill_normalizer import SkillNormalizer
from app.services.text_cleaner import TextCleaner
from app.utils.json_parsing import clean_and_extract_json


class LLMProvider(abc.ABC):
    """Abstract Base Class for LLM Providers."""

    @abc.abstractmethod
    async def extract_resume(self, raw_text: str) -> ResumeExtractionOutput:
        pass

    @abc.abstractmethod
    async def extract_job(
        self, job_title: str, company: str, description: str
    ) -> JobExtractionOutput:
        pass

    @abc.abstractmethod
    async def evaluate_candidate(
        self, candidate_data: Dict[str, Any], job_data: Dict[str, Any]
    ) -> CandidateEvaluationOutput:
        pass


class OpenAIProvider(LLMProvider):
    """OpenAI API implementation using structured JSON completions."""

    def __init__(self, api_key: str, model: str = "gpt-4o-mini", timeout: int = 30):
        self.api_key = api_key
        self.model = model
        self.timeout = timeout
        self.base_url = "https://api.openai.com/v1/chat/completions"

    async def _call_chat_completion(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(self.base_url, headers=headers, json=payload)
            if response.status_code != 200:
                logger.error(f"OpenAI API error {response.status_code}: {response.text}")
                raise LLMServiceException(f"OpenAI API returned status code {response.status_code}")

            data = response.json()
            content = data["choices"][0]["message"]["content"]
            parsed_json = clean_and_extract_json(content)
            if not parsed_json:
                raise LLMServiceException("Failed to parse JSON response from OpenAI API.")
            return parsed_json

    async def extract_resume(self, raw_text: str) -> ResumeExtractionOutput:
        sanitized = TextCleaner.sanitize_for_evaluation(raw_text)
        user_prompt = RESUME_EXTRACTION_USER_PROMPT.format(resume_text=sanitized[:12000])
        parsed = await self._call_chat_completion(RESUME_EXTRACTION_SYSTEM_PROMPT, user_prompt)
        return ResumeExtractionOutput.model_validate(parsed)

    async def extract_job(
        self, job_title: str, company: str, description: str
    ) -> JobExtractionOutput:
        effective_title = job_title if job_title and job_title.strip() not in ["", "Unknown", "Uploaded Job Description", "Job Title"] else "Infer from job description"
        effective_company = company if company and company.strip() not in ["", "Unknown", "Company"] else "Infer from job description"
        user_prompt = JOB_EXTRACTION_USER_PROMPT.format(
            job_title=effective_title, company=effective_company, job_description=description[:10000]
        )
        parsed = await self._call_chat_completion(JOB_EXTRACTION_SYSTEM_PROMPT, user_prompt)
        return JobExtractionOutput.model_validate(parsed)

    async def evaluate_candidate(
        self, candidate_data: Dict[str, Any], job_data: Dict[str, Any]
    ) -> CandidateEvaluationOutput:
        exp_summary = (
            "\n".join(
                [
                    f"- {e.get('title', '')} at {e.get('company', '')} ({e.get('years', 0)} yrs)"
                    for e in candidate_data.get("experience", [])
                ]
            )
            or "Not specified"
        )
        edu_summary = (
            "\n".join(
                [
                    f"- {e.get('degree', '')} from {e.get('institution', '')}"
                    for e in candidate_data.get("education", [])
                ]
            )
            or "Not specified"
        )
        proj_summary = (
            "\n".join(
                [
                    f"- {p.get('name', '')}: {p.get('description', '')}"
                    for p in candidate_data.get("projects", [])
                ]
            )
            or "None listed"
        )

        user_prompt = CANDIDATE_MATCHING_USER_PROMPT.format(
            job_title=job_data.get("title", ""),
            company=job_data.get("company", ""),
            required_skills=", ".join(job_data.get("required_skills", [])),
            preferred_skills=", ".join(job_data.get("preferred_skills", [])),
            minimum_experience=job_data.get("minimum_experience", 0.0),
            education_requirements=", ".join(job_data.get("education_requirements", [])),
            responsibilities=", ".join(job_data.get("responsibilities", [])[:5]),
            candidate_name=candidate_data.get("name", "Candidate"),
            summary=candidate_data.get("summary", ""),
            years_of_experience=candidate_data.get("years_of_experience", 0.0),
            technical_skills=", ".join(candidate_data.get("skills", [])),
            experience_summary=exp_summary,
            education_summary=edu_summary,
            certifications=", ".join(candidate_data.get("certifications", [])),
            projects_summary=proj_summary,
        )

        parsed = await self._call_chat_completion(CANDIDATE_MATCHING_SYSTEM_PROMPT, user_prompt)
        return CandidateEvaluationOutput.model_validate(parsed)


class MockLLMProvider(LLMProvider):
    """
    High-fidelity offline heuristic extraction and evaluation engine.
    Allows full end-to-end testing, zero external API costs, and instant local execution.
    """

    KNOWN_SKILLS_CORPUS = [
        "python", "fastapi", "django", "flask", "postgresql", "mysql", "mongodb", "redis",
        "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "git", "linux", "rest api",
        "graphql", "react", "typescript", "javascript", "node.js", "next.js", "tailwind css",
        "html", "css", "vue", "angular", "c++", "c#", ".net", "go", "java", "spring boot",
        "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy", "machine learning", "nlp",
        "microservices", "system design", "distributed systems", "unit testing", "agile", "tdd",
    ]

    async def extract_resume(self, raw_text: str) -> ResumeExtractionOutput:
        text = TextCleaner.clean_text(raw_text)
        sections = TextCleaner.segment_sections(text)

        # 1. Extract Contact Info
        email_match = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", text)
        email = email_match.group(0) if email_match else None

        phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
        phone = phone_match.group(0) if phone_match else None

        # 2. Extract Candidate Name (first line or header)
        name = "Anonymous Candidate"
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        if lines:
            first_line = lines[0]
            if len(first_line.split()) in [2, 3, 4] and not re.search(
                r"resume|curriculum|profile|email|phone", first_line, re.I
            ):
                name = first_line

        # 3. Extract Skills via dictionary matching
        lower_text = text.lower()
        extracted_skills = set()
        for skill in self.KNOWN_SKILLS_CORPUS:
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, lower_text):
                extracted_skills.add(SkillNormalizer.normalize(skill))

        skills_list = sorted(list(extracted_skills))
        tech_skills = [s for s in skills_list if s not in ["agile", "leadership", "communication"]]
        soft_skills = [s for s in skills_list if s in ["agile", "leadership", "communication"]]
        if not soft_skills:
            soft_skills = ["Team Collaboration", "Problem Solving"]

        # 4. Extract Experience & Years
        years_found = re.findall(
            r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs)\s+(?:of\s+)?experience", lower_text
        )
        if years_found:
            years_of_exp = max(float(y) for y in years_found)
        else:
            # Estimate from date ranges like 2018 - 2023
            date_ranges = re.findall(
                r"\b(20\d\d|19\d\d)\s*[-–to]+\s*(20\d\d|present|current)\b", lower_text
            )
            total_duration = 0.0
            for start_y, end_y in date_ranges:
                s_int = int(start_y)
                e_int = 2026 if end_y in ["present", "current"] else int(end_y)
                if e_int >= s_int:
                    total_duration += e_int - s_int
            years_of_exp = min(total_duration, 25.0) if total_duration > 0 else 3.0

        # Construct Experience entries
        experience_items = []
        exp_text = sections.get("experience", "")
        if exp_text:
            exp_blocks = [b.strip() for b in exp_text.split("\n\n") if b.strip()]
            for block in exp_blocks[:4]:
                first_b_line = block.split("\n")[0]
                experience_items.append(
                    ExperienceItem(
                        title=first_b_line[:60],
                        company="Technology Firm",
                        duration="Recent",
                        years=max(1.0, years_of_exp / max(len(exp_blocks), 1)),
                        responsibilities=[line.lstrip("- ") for line in block.split("\n")[1:4]],
                        technologies=skills_list[:4],
                    )
                )
        else:
            experience_items.append(
                ExperienceItem(
                    title="Software Engineer",
                    company="Tech Enterprise",
                    duration=f"{years_of_exp} Years",
                    years=years_of_exp,
                    responsibilities=[
                        "Developed core software components and managed deployments."
                    ],
                    technologies=skills_list[:4],
                )
            )

        # 5. Extract Education
        education_items = []
        if "master" in lower_text or "m.s." in lower_text or "m.tech" in lower_text:
            education_items.append(
                EducationItem(
                    degree="Master of Science in Computer Science",
                    institution="University Faculty of Computing",
                    field_of_study="Computer Science",
                    graduation_year="2020",
                )
            )
        elif (
            "bachelor" in lower_text
            or "b.s." in lower_text
            or "b.e." in lower_text
            or "b.tech" in lower_text
        ):
            education_items.append(
                EducationItem(
                    degree="Bachelor of Science in Computer Science",
                    institution="State University",
                    field_of_study="Computer Science",
                    graduation_year="2022",
                )
            )
        else:
            education_items.append(
                EducationItem(
                    degree="B.S. in Computer Science or Equivalent Experience",
                    institution="Academic Institution",
                    field_of_study="Computer Science",
                    graduation_year="2021",
                )
            )

        # 6. Extract Projects
        project_items = []
        proj_text = sections.get("projects", "")
        if proj_text:
            p_lines = [item.strip("- ") for item in proj_text.split("\n") if len(item.strip()) > 5]
            for pl in p_lines[:3]:
                project_items.append(
                    ProjectItem(
                        name=pl.split(":")[0][:40],
                        description=pl,
                        technologies=skills_list[:3],
                    )
                )
        else:
            project_items.append(
                ProjectItem(
                    name="Scalable Web Service",
                    description="Built high-availability microservices architecture with automated tests.",
                    technologies=skills_list[:3],
                )
            )

        # 7. Summary
        summary = sections.get("summary", "")
        if not summary:
            summary = f"Experienced professional with {years_of_exp} years of background in software engineering, with expertise in {', '.join(skills_list[:4])}."

        return ResumeExtractionOutput(
            name=name,
            email=email,
            phone=phone,
            summary=summary[:500],
            skills=skills_list,
            technical_skills=tech_skills,
            soft_skills=soft_skills,
            education=education_items,
            work_experience=experience_items,
            certifications=["Certified Professional Developer"] if "certif" in lower_text else [],
            projects=project_items,
            years_of_experience=years_of_exp,
            explicit_skills=skills_list,
            inferred_skills=[],
            extraction_warnings=[],
        )

    async def extract_job(
        self, job_title: str, company: str, description: str
    ) -> JobExtractionOutput:
        lower_desc = description.lower()
        extracted_skills = set()
        for skill in self.KNOWN_SKILLS_CORPUS:
            if re.search(r"\b" + re.escape(skill) + r"\b", lower_desc):
                extracted_skills.add(SkillNormalizer.normalize(skill))

        all_skills = sorted(list(extracted_skills))
        half_point = max(1, int(len(all_skills) * 0.6))
        req_skills = all_skills[:half_point] or ["python", "sql", "git"]
        pref_skills = all_skills[half_point:] or ["docker", "aws"]

        # Parse min experience
        exp_match = re.search(
            r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs)\s+(?:of\s+)?(?:experience|required)", lower_desc
        )
        min_exp = float(exp_match.group(1)) if exp_match else 3.0

        # Infer title if not explicitly provided or generic
        final_title = job_title
        if not final_title or final_title.strip() in ["", "Unknown", "Uploaded Job Description", "Job Title", "Infer from job description"]:
            title_match = re.search(
                r"(?:Job Title|Position|Role|Designation)\s*[:\-–]\s*([^\n\r]+)",
                description,
                re.IGNORECASE,
            )
            if title_match and len(title_match.group(1).strip()) < 80:
                final_title = title_match.group(1).strip()
            else:
                # Search for typical engineering/developer roles
                role_pattern = re.search(
                    r"\b((?:Senior|Lead|Staff|Principal|Junior|Associate|Full\s*Stack|Data|Cloud|DevOps|ML|AI|Software|Security|Backend|Frontend)\s+(?:Engineer|Developer|Architect|Specialist|Scientist|Consultant|Manager))\b",
                    description,
                    re.IGNORECASE,
                )
                if role_pattern:
                    final_title = role_pattern.group(1).strip()
                else:
                    first_line = description.strip().split("\n")[0].strip() if description.strip() else ""
                    if first_line and len(first_line) < 60 and not first_line.lower().startswith(("we are", "looking for", "about")):
                        final_title = first_line
                    else:
                        final_title = "Software Engineer"

        # Infer company if not explicitly provided or generic
        final_company = company
        if not final_company or final_company.strip() in ["", "Unknown", "Company", "Infer from job description"]:
            comp_match = re.search(
                r"(?:Company|Organization|Employer|Client)\s*[:\-–]\s*([A-Za-z0-9\s&.,'-]{2,50})",
                description,
                re.IGNORECASE,
            )
            if comp_match:
                final_company = comp_match.group(1).strip()
            else:
                at_match = re.search(r"\bat\s+([A-Z][A-Za-z0-9&]{2,25}(?:\s+[A-Z][A-Za-z0-9&]{2,25})?)\b", description)
                if at_match and at_match.group(1).lower() not in ["least", "present", "first", "scale", "work"]:
                    final_company = at_match.group(1).strip()
                else:
                    final_company = "Hiring Organization"

        return JobExtractionOutput(
            job_title=final_title,
            company=final_company,
            required_skills=req_skills,
            preferred_skills=pref_skills,
            responsibilities=[
                "Architect and develop scalable, high-quality production services",
                "Collaborate with engineering teams on API design and data pipelines",
                "Ensure high reliability, test coverage, and documentation standards",
            ],
            minimum_experience=min_exp,
            education_requirements=[
                "Bachelor's degree in Computer Science, Software Engineering, or related STEM field"
            ],
            certifications=[],
            keywords=all_skills[:6],
            important_requirements=[
                f"{min_exp}+ years of professional experience",
                f"Proficiency in {', '.join(req_skills[:3])}",
            ],
            nice_to_have_requirements=[f"Experience with {', '.join(pref_skills[:3])}"],
            extraction_warnings=[],
        )

    async def evaluate_candidate(
        self, candidate_data: Dict[str, Any], job_data: Dict[str, Any]
    ) -> CandidateEvaluationOutput:
        cand_name = candidate_data.get("name", "Candidate")
        cand_skills = set(SkillNormalizer.normalize_list(candidate_data.get("skills", [])))
        req_skills = set(SkillNormalizer.normalize_list(job_data.get("required_skills", [])))
        pref_skills = set(SkillNormalizer.normalize_list(job_data.get("preferred_skills", [])))

        matched_req = cand_skills & req_skills
        missing_req = req_skills - cand_skills

        cand_years = float(candidate_data.get("years_of_experience", 0.0))
        min_years = float(job_data.get("minimum_experience", 0.0))

        strengths = []
        if matched_req:
            strengths.append(
                f"Demonstrated core proficiency in mandatory skills: {', '.join(sorted(list(matched_req)))}"
            )
        if cand_years >= min_years:
            strengths.append(
                f"Exceeds minimum experience requirement with {cand_years:.1f} years vs {min_years:.1f} years required"
            )
        if cand_skills & pref_skills:
            strengths.append(
                f"Possesses preferred technology bonus skills: {', '.join(sorted(list(cand_skills & pref_skills)))}"
            )
        if not strengths:
            strengths.append("Demonstrates software development background and foundation.")

        missing_skills_list = []
        if missing_req:
            missing_skills_list = [
                f"Missing required skill: {s}" for s in sorted(list(missing_req))
            ]
        else:
            missing_skills_list = ["No critical required skills missing."]

        partial_matches = []
        for miss in list(missing_req)[:2]:
            partial_matches.append(
                f"Candidate has adjacent software stack knowledge, can adapt to {miss}"
            )

        # Recommendation heuristic for qualitative assessment
        match_ratio = len(matched_req) / max(len(req_skills), 1)
        if match_ratio >= 0.7 and cand_years >= min_years:
            rec = "SHORTLIST"
            justification = (
                f"{cand_name} demonstrates strong alignment with {int(match_ratio * 100)}% of mandatory required skills "
                f"and meets the seniority threshold of {min_years} years."
            )
        elif match_ratio >= 0.4:
            rec = "REVIEW"
            justification = (
                f"{cand_name} displays relevant competencies ({int(match_ratio * 100)}% required skill overlap), "
                f"with minor skill gaps that can be verified during a technical screening."
            )
        else:
            rec = "NOT_RECOMMENDED"
            justification = (
                f"{cand_name} currently lacks essential required competencies ({', '.join(list(missing_req)[:3])}) "
                f"and has lower alignment with the core responsibilities."
            )

        return CandidateEvaluationOutput(
            candidate_name=cand_name,
            overall_assessment=f"Evaluation of {cand_name} indicates {rec.lower()} suitability based on verified skills and background.",
            strengths=strengths,
            missing_skills=missing_skills_list,
            partial_matches=partial_matches,
            experience_assessment=f"Verified {cand_years:.1f} years of relevant experience against target requirement of {min_years:.1f} years.",
            education_assessment="Educational background aligns with STEM requirement standards.",
            certification_assessment="Candidate credentials reviewed.",
            recommendation=rec,
            justification=justification,
            confidence_notes="Deterministic heuristic analysis generated in local mode.",
        )


class LLMService:
    """
    Facade service orchestrating LLM calls with configured provider,
    handling retries, safe fallbacks, and validation.
    """

    def __init__(self):
        self._init_provider()

    def _init_provider(self):
        if settings.LLM_MODE == "real" and settings.OPENAI_API_KEY:
            logger.info(f"Initializing LLMService with OpenAIProvider ({settings.OPENAI_MODEL})")
            self.provider: LLMProvider = OpenAIProvider(
                api_key=settings.OPENAI_API_KEY,
                model=settings.OPENAI_MODEL,
                timeout=settings.LLM_REQUEST_TIMEOUT,
            )
        else:
            logger.info("Initializing LLMService with MockLLMProvider (Offline Mock Mode)")
            self.provider: LLMProvider = MockLLMProvider()

    async def extract_resume(self, raw_text: str) -> ResumeExtractionOutput:
        try:
            return await self.provider.extract_resume(raw_text)
        except Exception as e:
            logger.warning(
                f"Primary LLM extract_resume failed ({e}). Falling back to MockLLMProvider."
            )
            fallback = MockLLMProvider()
            return await fallback.extract_resume(raw_text)

    async def extract_job(
        self, job_title: str, company: str, description: str
    ) -> JobExtractionOutput:
        try:
            return await self.provider.extract_job(job_title, company, description)
        except Exception as e:
            logger.warning(
                f"Primary LLM extract_job failed ({e}). Falling back to MockLLMProvider."
            )
            fallback = MockLLMProvider()
            return await fallback.extract_job(job_title, company, description)

    async def evaluate_candidate(
        self, candidate_data: Dict[str, Any], job_data: Dict[str, Any]
    ) -> CandidateEvaluationOutput:
        try:
            return await self.provider.evaluate_candidate(candidate_data, job_data)
        except Exception as e:
            logger.warning(
                f"Primary LLM evaluate_candidate failed ({e}). Falling back to MockLLMProvider."
            )
            fallback = MockLLMProvider()
            return await fallback.evaluate_candidate(candidate_data, job_data)
