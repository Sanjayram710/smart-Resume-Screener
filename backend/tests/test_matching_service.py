import pytest
from app.services.matching_service import MatchingService


def test_match_skills_exact_and_preferred():
    candidate_skills = ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"]
    required_skills = ["python", "fastapi", "postgresql"]
    # Docker matches exactly (1.0), Rust is completely missing (0.0)
    preferred_skills = ["docker", "rust"]

    res = MatchingService.match_skills(candidate_skills, required_skills, preferred_skills)

    # Candidate has 100% of required (python, fastapi, postgresql)
    assert res["required_coverage"] == 100.0
    # Candidate has 50% of preferred (docker matched 1.0, rust matched 0.0)
    assert res["preferred_coverage"] == 50.0
    # Skill score: 0.75 * 100 + 0.25 * 50 = 87.5
    assert res["skill_score"] == 87.5
    assert len(res["matched_skills"]) == 4  # 3 req + 1 pref
    assert len(res["missing_skills"]) == 1  # rust


def test_match_skills_semantic_family():
    candidate_skills = ["Docker"]
    required_skills = ["kubernetes"]
    # Docker and Kubernetes share the container_orchestration family -> 0.80 semantic similarity
    res = MatchingService.match_skills(candidate_skills, required_skills, [])
    assert res["required_coverage"] == 80.0
    assert res["matched_skills"][0]["match_type"] == "SEMANTIC"


def test_match_experience_proportional():
    assert MatchingService.match_experience(candidate_years=5.0, minimum_experience=3.0) == 100.0
    assert MatchingService.match_experience(candidate_years=2.0, minimum_experience=4.0) == 50.0
    assert MatchingService.match_experience(candidate_years=0.0, minimum_experience=0.0) == 100.0


def test_match_education_hierarchy():
    master_edu = [{"degree": "Master of Science in Computer Science"}]
    bachelor_req = ["Bachelor's Degree in Computer Science"]
    # Master satisfies Bachelor
    assert MatchingService.match_education(master_edu, bachelor_req) == 100.0

    bachelor_edu = [{"degree": "Bachelor of Science"}]
    phd_req = ["PhD in Computer Science"]
    assert MatchingService.match_education(bachelor_edu, phd_req) < 100.0
