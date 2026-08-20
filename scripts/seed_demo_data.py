import asyncio
import json
import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "../backend")))

from app.db.base import Base
from app.db.database import engine, SessionLocal
from app.models.job import Job
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.job_repository import JobRepository
from app.repositories.resume_repository import ResumeRepository
from app.schemas.job import JobCreate
from app.services.job_parser import JobParserService
from app.services.llm_service import LLMService
from app.services.pdf_parser import PDFParser
from app.services.resume_parser import ResumeParserService
from app.services.screening_service import ScreeningService
from app.core.security import compute_file_hash


async def seed_database():
    print("=" * 60)
    print("SEEDING SMART RESUME SCREENER DEMO DATA")
    print("=" * 60)

    # 1. Initialize schema
    print("[1/5] Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    job_repo = JobRepository(db)
    resume_repo = ResumeRepository(db)
    cand_repo = CandidateRepository(db)
    llm_service = LLMService()
    job_parser = JobParserService(llm_service)
    resume_parser = ResumeParserService(llm_service)

    # Clean existing data for a fresh seed
    db.query(Job).delete()
    db.commit()

    # 2. Seed Jobs
    print("[2/5] Creating sample job descriptions...")
    jobs_dir = os.path.realpath(os.path.join(os.path.dirname(__file__), "../sample_data/jobs"))
    created_jobs = []

    for filename in sorted(os.listdir(jobs_dir)):
        if filename.endswith(".json"):
            filepath = os.path.join(jobs_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                job_data = json.load(f)

            job_in = JobCreate(**job_data)
            structured_data = await job_parser.parse_and_structure_job(
                title=job_in.title,
                company=job_in.company,
                description=job_in.description,
                user_required_skills=job_in.required_skills,
                user_preferred_skills=job_in.preferred_skills,
                user_min_exp=job_in.minimum_experience,
                user_education=job_in.education_requirements,
                user_certifications=job_in.certifications,
                auto_extract=False,
            )
            job = job_repo.create(job_in, extra_data=structured_data)
            created_jobs.append(job)
            print(f"  [+] Created Job #{job.id}: {job.title} at {job.company}")

    # Target primary job for demo: Senior Backend Engineer
    primary_job = created_jobs[0]

    # 3. Upload Resumes
    print(f"\n[3/5] Uploading 5 sample candidate resumes to Job #{primary_job.id}...")
    resumes_dir = os.path.realpath(os.path.join(os.path.dirname(__file__), "../sample_data/resumes"))

    uploaded_resumes = []
    for filename in sorted(os.listdir(resumes_dir)):
        if filename.endswith(".pdf"):
            filepath = os.path.join(resumes_dir, filename)
            with open(filepath, "rb") as f:
                content = f.read()

            raw_text, meta = PDFParser.extract_text_from_bytes(content, filename)
            f_hash = compute_file_hash(content)

            resume = resume_repo.create(
                job_id=primary_job.id,
                filename=filename,
                raw_text=raw_text,
                file_hash=f_hash,
                file_path=filepath,
            )

            # Parse candidate profile
            parsed_out = await resume_parser.parse_resume_content(content, filename)
            cand_data = parsed_out["candidate_data"]
            cand_data["resume_id"] = resume.id
            candidate = cand_repo.create(cand_data)
            resume_repo.update_status(resume.id, "PARSED")
            uploaded_resumes.append(resume)
            print(f"  [+] Uploaded & Parsed: {filename} -> Candidate: {candidate.name} ({candidate.years_of_experience:.1f} yrs exp)")

    # 4. Trigger Screening Workflow
    print(f"\n[4/5] Running deterministic screening & AI evaluation for Job #{primary_job.id}...")
    screening_svc = ScreeningService(db)
    result = await screening_svc.screen_job_candidates(primary_job.id)

    # 5. Display Leaderboard Summary
    print("\n[5/5] Screening Completed! CANDIDATE RANKINGS LEADERBOARD:")
    print("-" * 80)
    print(f"{'Rank':<5} | {'Candidate Name':<20} | {'Score':<6} | {'Recommendation':<16} | {'Exp':<6} | {'Matched Skills'}")
    print("-" * 80)
    for r in result.rankings:
        print(f"#{r.rank:<4} | {r.candidate_name:<20} | {r.overall_score:<6.1f} | {r.recommendation:<16} | {r.years_of_experience:<4.1f}yr | {r.matched_skills_count} matched")
    print("-" * 80)
    print(f"Summary: {result.shortlisted_count} Shortlisted, {result.review_count} Review, {result.not_recommended_count} Not Recommended.")
    print("Demo database successfully seeded!")

    db.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
