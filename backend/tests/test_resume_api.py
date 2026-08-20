import io

from fastapi.testclient import TestClient
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def create_pdf(text: str) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    c.drawString(100, 750, text)
    c.save()
    buf.seek(0)
    return buf.read()


def test_upload_resume_and_list(client: TestClient):
    # 1. Create a Job
    job_payload = {
        "title": "Fullstack Developer",
        "company": "Tech Innovations",
        "description": "Fullstack role requiring React, TypeScript, and Node.js with 3 years experience.",
        "required_skills": ["React", "TypeScript", "Node.js"],
        "preferred_skills": ["Tailwind CSS"],
        "minimum_experience": 3.0,
        "education_requirements": [],
        "certifications": [],
        "auto_extract": False,
    }
    job_resp = client.post("/api/jobs", json=job_payload)
    job_id = job_resp.json()["data"]["id"]

    # 2. Upload Resume PDF
    pdf_bytes = create_pdf(
        "Alice Miller - Senior React and TypeScript Engineer with 4 years experience."
    )
    files = [("files", ("alice_resume.pdf", pdf_bytes, "application/pdf"))]

    upload_resp = client.post(f"/api/jobs/{job_id}/resumes", files=files)
    assert upload_resp.status_code == 201
    data = upload_resp.json()["data"]
    assert data["total_uploaded"] == 1
    assert len(data["successful_resumes"]) == 1

    # 3. Test Duplicate Upload Rejection
    dup_resp = client.post(f"/api/jobs/{job_id}/resumes", files=files)
    assert dup_resp.status_code == 201
    dup_data = dup_resp.json()["data"]
    assert dup_data["total_uploaded"] == 0
    assert len(dup_data["failed_resumes"]) == 1

    # 4. List Resumes
    list_resp = client.get(f"/api/jobs/{job_id}/resumes")
    assert list_resp.status_code == 200
    assert len(list_resp.json()["data"]) == 1
