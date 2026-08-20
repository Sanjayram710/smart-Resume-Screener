import pytest

from app.services.llm_service import MockLLMProvider


@pytest.mark.asyncio
async def test_mock_llm_resume_extraction():
    provider = MockLLMProvider()
    resume_text = """
    Alice Johnson
    Email: alice.johnson@example.com
    Phone: (555) 123-4567

    SUMMARY
    Senior Backend Engineer with 5 years experience building Python, FastAPI, and PostgreSQL systems.

    SKILLS
    Python, FastAPI, PostgreSQL, Docker, AWS, Git

    EXPERIENCE
    Lead Engineer at AlphaTech (2021 - 2024)
    - Built microservices and optimized queries

    EDUCATION
    Master of Science in Computer Science, 2020
    """
    output = await provider.extract_resume(resume_text)
    assert output.name == "Alice Johnson"
    assert output.email == "alice.johnson@example.com"
    assert "python" in [s.lower() for s in output.skills]
    assert output.years_of_experience >= 3.0
    assert len(output.education) > 0


@pytest.mark.asyncio
async def test_mock_llm_job_extraction():
    provider = MockLLMProvider()
    desc = """
    Looking for a Senior Python Developer with 4+ years experience.
    Must have experience in Python, FastAPI, PostgreSQL, and Docker.
    Preferred: Kubernetes, AWS.
    """
    output = await provider.extract_job("Senior Python Engineer", "TechCorp", desc)
    assert output.job_title == "Senior Python Engineer"
    assert len(output.required_skills) > 0
    assert output.minimum_experience >= 3.0


@pytest.mark.asyncio
async def test_mock_llm_candidate_evaluation():
    provider = MockLLMProvider()
    cand_data = {
        "name": "Alice",
        "skills": ["python", "fastapi", "postgresql", "docker"],
        "years_of_experience": 5.0,
        "education": [{"degree": "B.S. in Computer Science"}],
    }
    job_data = {
        "title": "Backend Dev",
        "company": "Startup",
        "required_skills": ["python", "fastapi", "postgresql"],
        "preferred_skills": ["docker"],
        "minimum_experience": 3.0,
    }
    eval_out = await provider.evaluate_candidate(cand_data, job_data)
    assert eval_out.recommendation == "SHORTLIST"
    assert len(eval_out.strengths) > 0
    assert len(eval_out.justification) > 0
