from app.services.text_cleaner import TextCleaner


def test_clean_text_normalizes_bullets_and_whitespace():
    raw = "• Python\n• FastAPI\r\n\r\n\t  • PostgreSQL   \n\n\n\n• Docker"
    cleaned = TextCleaner.clean_text(raw)
    assert "- Python" in cleaned
    assert "- FastAPI" in cleaned
    assert "- PostgreSQL" in cleaned
    assert "- Docker" in cleaned
    assert "\r" not in cleaned


def test_segment_sections():
    sample_resume = """
    John Doe
    Email: john@example.com

    SUMMARY
    Senior backend software engineer with 5 years experience.

    TECHNICAL SKILLS
    Python, FastAPI, Docker, PostgreSQL

    WORK EXPERIENCE
    Software Engineer at Tech Co (2020 - 2024)
    - Built REST APIs

    EDUCATION
    B.S. in Computer Science, 2020
    """
    sections = TextCleaner.segment_sections(sample_resume)
    assert "summary" in sections
    assert "skills" in sections
    assert "experience" in sections
    assert "education" in sections


def test_sanitize_redacts_protected_attributes():
    biased_text = "Candidate is single female Hindu born 1995 from India. Skilled in Python."
    sanitized = TextCleaner.sanitize_for_evaluation(biased_text)
    assert "female" not in sanitized.lower()
    assert "single" not in sanitized.lower()
    assert "hindu" not in sanitized.lower()
    assert "python" in sanitized.lower()
