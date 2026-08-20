import pytest
from app.services.skill_normalizer import SkillNormalizer


def test_clean_skill_string():
    assert SkillNormalizer.clean_skill_string("  Python 3  ") == "python 3"
    assert SkillNormalizer.clean_skill_string(",React.js,") == "react.js"
    assert SkillNormalizer.clean_skill_string("  ") == ""


def test_normalize_aliases():
    assert SkillNormalizer.normalize("Python3") == "python"
    assert SkillNormalizer.normalize("React.js") == "react"
    assert SkillNormalizer.normalize("PostgreSQL") == "postgresql"
    assert SkillNormalizer.normalize("postgres") == "postgresql"
    assert SkillNormalizer.normalize("AWS") == "amazon web services"
    assert SkillNormalizer.normalize("K8s") == "kubernetes"
    assert SkillNormalizer.normalize("Golang") == "go"
    assert SkillNormalizer.normalize("REST APIs") == "rest api"
    assert SkillNormalizer.normalize("Docker") == "docker"


def test_normalize_list_deduplication():
    raw_list = ["Python", "python3", "React.js", "React", "Docker", "docker"]
    normalized = SkillNormalizer.normalize_list(raw_list)
    assert normalized == ["python", "react", "docker"]


def test_compare_skills_exact():
    sim, mtype = SkillNormalizer.compare_skills("Python", "python3")
    assert sim == 1.0
    assert mtype == "EXACT"


def test_compare_skills_semantic_family():
    sim, mtype = SkillNormalizer.compare_skills("PostgreSQL", "MySQL")
    assert sim == 0.80
    assert mtype == "SEMANTIC"


def test_compare_skills_unrelated():
    sim, mtype = SkillNormalizer.compare_skills("Python", "Photoshop")
    assert sim == 0.0
    assert mtype == "NONE"
