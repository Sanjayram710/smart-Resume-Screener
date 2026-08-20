# 2-to-3 Minute Demo Walkthrough Guide

This guide describes the recommended flow to demonstrate the full capabilities of **Smart Resume Screener** in under 3 minutes.

---

## Step 1: Open the Recruiter Dashboard
- Navigate to `http://localhost:5173` (or `http://localhost:3000` in Docker).
- Point out the clean dark-mode recruiter design, high-level metrics (Active Jobs, Resumes Uploaded, Candidates Screened), and active requisitions.

## Step 2: Create a Job Requisition
- Click **"+ Create Job"** in the top navigation.
- Click one of the **Quick Demo Templates** (e.g. **"Backend (Python)"** or **"AI / ML Engineer"**).
- Notice how title, company, description, required skills, preferred skills, min experience, and education requirements populate instantly.
- Click **"Create Job & Initialize Screener"**.

## Step 3: Upload Sample Resumes
- The app automatically opens the resume upload portal for the created job.
- Drag and drop or browse to `sample_data/resumes/` and select all 5 sample candidate resumes:
  1. `candidate_1_alice_backend_lead.pdf` (Senior Backend Lead)
  2. `candidate_2_bob_fullstack_dev.pdf` (Fullstack React/Node/Python Developer)
  3. `candidate_3_carol_ml_specialist.pdf` (AI/ML Specialist)
  4. `candidate_4_david_junior_dev.pdf` (Junior Developer)
  5. `candidate_5_eve_marketing_manager.pdf` (Growth Marketing Manager)
- Click **"Upload 5 Resumes"** to extract text via PyMuPDF and parse structured profiles.

## Step 4: Run Candidate Screening
- Click **"Run Candidate Screening"**.
- The deterministic scoring engine matches skills, calculates experience proportionality, evaluates education/certifications, computes semantic embedding similarity, and obtains LLM qualitative evaluations.

## Step 5: Inspect Ranked Leaderboard
- Inspect the candidate ranking table:
  - Candidates are sorted from highest deterministic score to lowest.
  - Color-coded scores on a 1.0 – 10.0 scale.
  - Shortlisting recommendation badges (**SHORTLIST**, **REVIEW**, **NOT RECOMMENDED**).

## Step 6: Deep-Dive Candidate Inspection
- Click **"Inspect"** on Candidate #1.
- Review:
  - **Score Breakdown Card**: 5 deterministic subscores (Skill 40%, Experience 25%, Semantic 20%, Education 10%, Certification 5%).
  - **Skill Alignment Analysis**: Exact verified matches vs semantic alias matches vs missing skills.
  - **AI Recruiter Intelligence**: Evidence-based justification, key strengths, and screener caveats.
  - **Candidate Timeline**: Verified work history, education degrees, and key projects.
