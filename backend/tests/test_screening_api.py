import io

from fastapi.testclient import TestClient
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def create_pdf(name: str, skills: str, years: str) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    c.drawString(50, 750, f"Name: {name}")
    c.drawString(50, 720, f"Summary: Experienced Developer with {years} years experience.")
    c.drawString(50, 690, f"Skills: {skills}")
    c.drawString(50, 660, "Education: Bachelor of Science in Computer Science (2020)")
    c.save()
    buf.seek(0)
    return buf.read()


def test_full_screening_and_ranking_workflow(client: TestClient):
    # 1. Create Job
    job_payload = {
        "title": "Senior Python Backend Engineer",
        "company": "ScaleAI Labs",
        "description": "Must have strong background in Python, FastAPI, PostgreSQL, and Docker. Minimum 3 years experience.",
        "required_skills": ["Python", "FastAPI", "PostgreSQL"],
        "preferred_skills": ["Docker", "Kubernetes"],
        "minimum_experience": 3.0,
        "education_requirements": ["Bachelor's in Computer Science"],
        "certifications": [],
        "auto_extract": False,
    }
    job_resp = client.post("/api/jobs", json=job_payload)
    job_id = job_resp.json()["data"]["id"]

    # 2. Upload Strong Candidate (Alice)
    alice_pdf = create_pdf("Alice Lead", "Python, FastAPI, PostgreSQL, Docker, AWS", "5")
    # Upload Moderate Candidate (Bob)
    bob_pdf = create_pdf("Bob Junior", "Python, Flask, SQLite", "1.5")

    files = [
        ("files", ("alice.pdf", alice_pdf, "application/pdf")),
        ("files", ("bob.pdf", bob_pdf, "application/pdf")),
    ]
    upload_resp = client.post(f"/api/jobs/{job_id}/resumes", files=files)
    assert upload_resp.status_code == 201

    # 3. Trigger Screening Workflow
    screen_resp = client.post(f"/api/jobs/{job_id}/screen")
    assert screen_resp.status_code == 200
    screening_result = screen_resp.json()["data"]

    assert screening_result["screened_candidates_count"] == 2
    rankings = screening_result["rankings"]
    assert len(rankings) == 2

    # Verify rank 1 has higher score than rank 2
    rank1 = rankings[0]
    rank2 = rankings[1]
    assert rank1["overall_score"] >= rank2["overall_score"]
    assert rank1["rank"] == 1
    assert rank2["rank"] == 2

    # Check Candidate Detail and Screening Detail endpoints
    cand_id = rank1["candidate_id"]
    cand_detail_resp = client.get(f"/api/candidates/{cand_id}")
    assert cand_detail_resp.status_code == 200
    assert cand_detail_resp.json()["data"]["screening"] is not None

    screening_id = rank1["screening_id"]
    screen_detail_resp = client.get(f"/api/screenings/{screening_id}")
    assert screen_detail_resp.status_code == 200
    assert screen_detail_resp.json()["data"]["overall_score"] == rank1["overall_score"]
