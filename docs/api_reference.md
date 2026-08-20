# REST API Reference Documentation

Base URL: `http://localhost:8000/api`
Interactive Swagger / OpenAPI UI: `http://localhost:8000/docs`

---

## Endpoints

### 1. Health
- `GET /health`: Returns system health, database connection, and LLM mode.

### 2. Jobs
- `POST /jobs`: Create a new job requisition (supports automatic LLM requirement structuring).
- `GET /jobs`: List all job requisitions with resume and screening counts.
- `GET /jobs/{job_id}`: Retrieve detailed job posting information.
- `PUT /jobs/{job_id}`: Update an existing job requisition.
- `DELETE /jobs/{job_id}`: Delete a job posting and cascade delete linked resumes/candidates/screenings.

### 3. Resumes
- `POST /jobs/{job_id}/resumes`: Multi-file upload endpoint (PDF or TXT). Extracts raw text with PyMuPDF, hashes content for duplicate detection, and parses structured candidate profiles.
- `GET /jobs/{job_id}/resumes`: List all resumes uploaded for a job.

### 4. Candidates
- `GET /jobs/{job_id}/candidates`: List all candidates associated with a job.
- `GET /candidates/{candidate_id}`: Retrieve candidate details, experience timeline, education, projects, and screening evaluation.

### 5. Screening & Leaderboard
- `POST /jobs/{job_id}/screen`: Execute deterministic 6-stage candidate screening and ranking workflow.
- `GET /jobs/{job_id}/rankings`: Retrieve ranked candidate leaderboard with scores and shortlisting recommendations.
- `GET /screenings/{screening_id}`: Retrieve individual screening score breakdown and AI explanation.
