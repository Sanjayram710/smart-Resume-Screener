from app.services.scoring_service import ScoringService


def test_perfect_score_calculation():
    score, pct, rec = ScoringService.calculate_overall_score(
        skill_score=100.0,
        experience_score=100.0,
        semantic_score=100.0,
        education_score=100.0,
        certification_score=100.0,
    )
    assert score == 10.0
    assert pct == 100.0
    assert rec == "SHORTLIST"


def test_strong_candidate_shortlist():
    # 85% skills (34), 90% exp (22.5), 80% sem (16), 100% edu (10), 100% cert (5) = 87.5% -> 8.8
    score, pct, rec = ScoringService.calculate_overall_score(
        skill_score=85.0,
        experience_score=90.0,
        semantic_score=80.0,
        education_score=100.0,
        certification_score=100.0,
    )
    assert score >= 7.0
    assert rec == "SHORTLIST"


def test_moderate_candidate_review():
    # 50% across all subscores = 50.0% -> 5.0
    score, pct, rec = ScoringService.calculate_overall_score(
        skill_score=55.0,
        experience_score=50.0,
        semantic_score=50.0,
        education_score=60.0,
        certification_score=50.0,
    )
    assert 5.0 <= score < 7.0
    assert rec == "REVIEW"


def test_weak_candidate_not_recommended():
    score, pct, rec = ScoringService.calculate_overall_score(
        skill_score=20.0,
        experience_score=20.0,
        semantic_score=30.0,
        education_score=40.0,
        certification_score=0.0,
    )
    assert score < 5.0
    assert rec == "NOT_RECOMMENDED"


def test_deterministic_consistency():
    # Calling the scoring function multiple times with identical inputs must yield identical results
    res1 = ScoringService.calculate_overall_score(75.5, 80.0, 70.0, 90.0, 80.0)
    res2 = ScoringService.calculate_overall_score(75.5, 80.0, 70.0, 90.0, 80.0)
    assert res1 == res2
