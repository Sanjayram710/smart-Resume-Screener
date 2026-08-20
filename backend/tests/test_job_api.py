from fastapi.testclient import TestClient


def test_create_and_get_job(client: TestClient):
    payload = {
        "title": "Senior Backend Engineer",
        "company": "Antigravity Labs",
        "description": "Seeking Python and FastAPI expert with PostgreSQL and Docker experience. 4+ years required.",
        "required_skills": ["Python", "FastAPI", "PostgreSQL"],
        "preferred_skills": ["Docker", "Kubernetes"],
        "minimum_experience": 4.0,
        "education_requirements": ["Bachelor's in Computer Science"],
        "certifications": [],
        "auto_extract": False,
    }

    create_resp = client.post("/api/jobs", json=payload)
    assert create_resp.status_code == 201
    created_data = create_resp.json()["data"]
    job_id = created_data["id"]
    assert created_data["title"] == "Senior Backend Engineer"

    # List jobs
    list_resp = client.get("/api/jobs")
    assert list_resp.status_code == 200
    assert len(list_resp.json()["data"]) >= 1

    # Get job detail
    get_resp = client.get(f"/api/jobs/{job_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["data"]["company"] == "Antigravity Labs"


def test_get_nonexistent_job_returns_404(client: TestClient):
    resp = client.get("/api/jobs/99999")
    assert resp.status_code == 404
