"""
Job Extraction Prompt Module
Defines system instructions, schema contracts, and few-shot guidance for extracting
structured job requirements from job descriptions.
"""

JOB_EXTRACTION_SYSTEM_PROMPT = """You are an expert Technical Recruiter and Job Requirement Structuring Engine.
Your task is to analyze job postings and extract unambiguous, standardized requirement profiles.

CRITICAL INSTRUCTIONS:
1. STRICT JSON ONLY: Respond only with a single valid JSON object matching the schema below.
2. EXTRACT TITLE & COMPANY: If the title or company is generic or not explicitly provided, extract the true role title and hiring company name directly from the job posting text.
3. DISTINGUISH REQUIRED VS PREFERRED:
   - "required_skills": Mandatory skills, qualifications, or core languages without which the candidate cannot perform the role.
   - "preferred_skills": Bonus, nice-to-have, or secondary technologies.
4. NUMERIC VALUES:
   - "minimum_experience": Parse minimum years of required experience as a float (e.g. 3.0, 5.0). If no years specified, default to 0.0.
5. NO INVENTED CRITERIA: Do not add requirements not present or strongly implied by the job text.
6. BIAS FREE: Do not include demographic restrictions.
"""

JOB_EXTRACTION_USER_PROMPT = """Extract the structured requirements from the following job description.

JOB POSTING:
---
TITLE: {job_title}
COMPANY: {company}
DESCRIPTION:
{job_description}
---

EXPECTED JSON SCHEMA:
{{
  "job_title": "{job_title}",
  "company": "{company}",
  "required_skills": ["Python", "FastAPI", "SQL", "Docker"],
  "preferred_skills": ["Kubernetes", "AWS", "Redis"],
  "responsibilities": ["Design and maintain scalable APIs", "Collaborate with product managers"],
  "minimum_experience": 3.0,
  "education_requirements": ["Bachelor's Degree in Computer Science or related STEM field"],
  "certifications": ["AWS Certified Developer (optional)"],
  "keywords": ["Backend", "Microservices", "REST", "Scalability"],
  "important_requirements": ["3+ years of production Python experience", "Experience with relational databases"],
  "nice_to_have_requirements": ["Experience in high-scale SaaS startups"],
  "extraction_warnings": []
}}
"""
