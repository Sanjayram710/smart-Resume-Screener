# Production Prompt Engineering Pack

This document details the dedicated prompt modules used across the `smart-resume-screener` application.

## 1. Resume Extraction Prompt (`backend/app/prompts/resume_extraction.py`)

### Role & Constraints
- Extracts structured candidate profile data from raw resume text.
- Enforces strict JSON output.
- Forbids hallucination of dates, degrees, companies, or skills.
- Distinguishes `explicit_skills` from `inferred_skills`.
- Completely redacts protected demographic attributes.

### Output JSON Schema
```json
{
  "name": "Candidate Full Name or 'Anonymous Candidate'",
  "email": "candidate.email@example.com or null",
  "phone": "+1-555-0199 or null",
  "summary": "Professional summary",
  "skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
  "technical_skills": ["Python", "FastAPI", "SQL"],
  "soft_skills": ["Team Leadership", "Agile"],
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "institution": "University Name",
      "field_of_study": "Computer Science",
      "graduation_year": "2020"
    }
  ],
  "work_experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "duration": "2020 - 2023",
      "years": 3.0,
      "responsibilities": ["Built REST APIs with FastAPI"],
      "technologies": ["Python", "FastAPI"]
    }
  ],
  "certifications": ["AWS Certified Developer"],
  "projects": [
    {
      "name": "Microservice Architecture",
      "description": "High-throughput checkout service",
      "technologies": ["Go", "Redis"]
    }
  ],
  "years_of_experience": 3.5,
  "explicit_skills": ["Python", "FastAPI"],
  "inferred_skills": ["Microservices"],
  "extraction_warnings": []
}
```

---

## 2. Job Description Extraction Prompt (`backend/app/prompts/job_extraction.py`)

### Role & Constraints
- Parses raw job posting text into structured requirement fields.
- Distinguishes `required_skills` (mandatory) from `preferred_skills` (nice-to-have).
- Parses `minimum_experience` as a float.
- Extracts responsibilities and education requirements.

---

## 3. Candidate Qualitative Evaluation Prompt (`backend/app/prompts/candidate_matching.py`)

### Role & Constraints
- Evaluates candidate fit against job requirements with evidence citation.
- Provides `strengths`, `missing_skills`, `partial_matches`, and evidence-based `justification`.
- Does NOT invent numeric scores.
