import io
from fastapi.testclient import TestClient


def test_parse_jd_txt_file(client: TestClient):
    jd_content = (
        "Job Title: Senior Cloud & Backend Engineer\n"
        "Company: Apex Technologies\n\n"
        "About the Role:\n"
        "We are looking for a Senior Engineer with 5+ years of experience in Python, FastAPI, and Docker.\n"
        "You will design scalable APIs and manage PostgreSQL databases on AWS.\n\n"
        "Requirements:\n"
        "- 5+ years of software development experience\n"
        "- Strong proficiency in Python, FastAPI, PostgreSQL\n"
        "- Experience with Docker and AWS\n"
    )

    file_obj = io.BytesIO(jd_content.encode("utf-8"))
    files = {"file": ("job_description.txt", file_obj, "text/plain")}

    resp = client.post("/api/jobs/parse-jd", files=files)
    assert resp.status_code == 200
    data = resp.json()["data"]

    assert "python" in [s.lower() for s in data["required_skills"] + data["preferred_skills"]]
    assert data["minimum_experience"] >= 3.0
    assert data["title"] is not None
    assert len(data["description"]) > 20


def test_upload_jd_and_create_job(client: TestClient):
    jd_content = (
        "Role: Machine Learning Engineer\n"
        "Company: NeuralSphere AI\n"
        "We need an ML engineer with 3+ years in Python, PyTorch, Scikit-learn, and FastAPI.\n"
    )

    file_obj = io.BytesIO(jd_content.encode("utf-8"))
    files = {"file": ("ml_jd.txt", file_obj, "text/plain")}

    resp = client.post("/api/jobs/upload-jd", files=files)
    assert resp.status_code == 201
    job_data = resp.json()["data"]
    assert job_data["id"] > 0
    assert "NeuralSphere AI" in job_data["company"] or "Machine Learning" in job_data["title"]


def test_quick_match_jd_and_resumes(client: TestClient):
    jd_content = (
        "Job Title: Python Backend Engineer\n"
        "Company: DataStream Corp\n"
        "Required: Python, FastAPI, PostgreSQL, Docker, Git. 3+ years experience.\n"
    )

    resume_content = (
        "Alice Developer\n"
        "alice@datastream.com | +1 555-0199\n\n"
        "Summary:\n"
        "Backend Developer with 4 years of experience building Python APIs using FastAPI and PostgreSQL.\n\n"
        "Skills:\n"
        "Python, FastAPI, PostgreSQL, Docker, Git, Redis, Linux\n\n"
        "Experience:\n"
        "Senior Developer at TechLab (2021 - Present)\n"
        "- Architected REST APIs using FastAPI and PostgreSQL.\n"
    )

    jd_file = ("job_desc.txt", io.BytesIO(jd_content.encode("utf-8")), "text/plain")
    resume_file = ("alice_resume.txt", io.BytesIO(resume_content.encode("utf-8")), "text/plain")

    resp = client.post(
        "/api/jobs/quick-match",
        files=[("jd_file", jd_file), ("resumes", resume_file)],
    )

    assert resp.status_code == 200
    res_data = resp.json()["data"]
    assert res_data["screened_candidates_count"] >= 1
    assert len(res_data["rankings"]) >= 1

    first_candidate = res_data["rankings"][0]
    assert first_candidate["overall_score"] > 5.0
    assert first_candidate["recommendation"] in ["SHORTLIST", "REVIEW"]


def test_parse_and_screen_real_pdf_files(client: TestClient):
    import os
    jd_pdf_path = os.path.realpath(os.path.join(os.path.dirname(__file__), "../../sample_data/jobs/senior_backend_engineer_jd.pdf"))
    resume_pdf_path = os.path.realpath(os.path.join(os.path.dirname(__file__), "../../sample_data/resumes/candidate_1_alice_backend_lead.pdf"))

    if os.path.exists(jd_pdf_path) and os.path.exists(resume_pdf_path):
        with open(jd_pdf_path, "rb") as f_jd:
            jd_bytes = f_jd.read()
        with open(resume_pdf_path, "rb") as f_res:
            res_bytes = f_res.read()

        # 1. Test parsing JD PDF
        parse_resp = client.post(
            "/api/jobs/parse-jd",
            files={"file": ("senior_backend_engineer_jd.pdf", io.BytesIO(jd_bytes), "application/pdf")},
        )
        assert parse_resp.status_code == 200
        jd_data = parse_resp.json()["data"]
        assert len(jd_data["required_skills"]) > 0
        assert "python" in [s.lower() for s in jd_data["required_skills"] + jd_data["preferred_skills"]]

        # 2. Test Quick Match with real PDF JD and real PDF Resume
        match_resp = client.post(
            "/api/jobs/quick-match",
            files=[
                ("jd_file", ("senior_backend_engineer_jd.pdf", io.BytesIO(jd_bytes), "application/pdf")),
                ("resumes", ("candidate_1_alice.pdf", io.BytesIO(res_bytes), "application/pdf")),
            ],
        )
        assert match_resp.status_code == 200
        match_data = match_resp.json()["data"]
        assert match_data["screened_candidates_count"] == 1
        assert match_data["rankings"][0]["recommendation"] == "SHORTLIST"

