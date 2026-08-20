import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUTPUT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), "../sample_data/resumes"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

CANDIDATES = [
    {
        "filename": "candidate_1_alice_backend_lead.pdf",
        "name": "Alice Smith",
        "title": "Senior Backend & Cloud Engineer",
        "contact": "alice.smith@example.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/alicesmith",
        "summary": "Seasoned Backend Architect with 6+ years of specialized experience designing high-throughput RESTful APIs, distributed microservices, and event-driven data pipelines using Python, FastAPI, PostgreSQL, Docker, and AWS. Proven track record scaling backend systems to 10M+ daily requests.",
        "skills": "Python, FastAPI, Django, PostgreSQL, Redis, Docker, Kubernetes, AWS (ECS, S3, RDS), Git, CI/CD, Microservices, REST APIs, Unit Testing, System Design",
        "experience": [
            {
                "role": "Staff Backend Engineer - CloudScale Technologies",
                "dates": "2021 - Present (3.5 years)",
                "bullets": [
                    "Spearheaded architectural redesign of core payment microservices in Python & FastAPI, decreasing p99 latency by 45%.",
                    "Architected high-availability PostgreSQL database cluster with read-replicas, connection pooling, and automated failover.",
                    "Containerized 15+ backend services using Docker and orchestrated deployments on AWS ECS with GitHub Actions CI/CD."
                ]
            },
            {
                "role": "Senior Software Engineer - DataCore Systems",
                "dates": "2018 - 2021 (3.0 years)",
                "bullets": [
                    "Developed asynchronous REST APIs handling telemetry data ingestion using Python and Redis pub/sub.",
                    "Mentored 6 junior engineers on unit testing (Pytest) and clean architectural patterns (Domain-Driven Design)."
                ]
            }
        ],
        "education": "Master of Science in Computer Science - University of California, Berkeley (2018)\nBachelor of Science in Software Engineering - University of Washington (2016)",
        "certifications": "AWS Certified Solutions Architect - Professional | Certified Kubernetes Administrator (CKA)",
        "projects": "Distributed Task Queue: Built a lightweight Celery alternative in Python/Redis with Prometheus metrics."
    },
    {
        "filename": "candidate_2_bob_fullstack_dev.pdf",
        "name": "Bob Johnson",
        "title": "Fullstack Software Engineer",
        "contact": "bob.johnson@example.com | (555) 876-5432 | Austin, TX | github.com/bobjohnson",
        "summary": "Fullstack Developer with 4 years of experience building modern web applications using React, TypeScript, Node.js, Python, and PostgreSQL. Passionate about intuitive UI/UX and resilient API contracts.",
        "skills": "React, TypeScript, JavaScript, Python, FastAPI, Node.js, PostgreSQL, MongoDB, Tailwind CSS, Docker, Git, REST APIs, GraphQL",
        "experience": [
            {
                "role": "Fullstack Developer - Nexus Interactive",
                "dates": "2022 - Present (2.0 years)",
                "bullets": [
                    "Built fullstack customer portal using React 18, TypeScript, Tailwind CSS, and Python FastAPI backend.",
                    "Integrated PostgreSQL database with SQLAlchemy ORM, managing Alembic schema migrations and indexing."
                ]
            },
            {
                "role": "Frontend / Web Developer - PixelCraft Studios",
                "dates": "2020 - 2022 (2.0 years)",
                "bullets": [
                    "Engineered responsive UI components and state management with React and Redux Toolkit.",
                    "Collaborated with backend teams to consume RESTful endpoints and implement OAuth2 authentication."
                ]
            }
        ],
        "education": "Bachelor of Science in Computer Science - University of Texas at Austin (2020)",
        "certifications": "Meta Certified Front-End Developer",
        "projects": "DevBoard: Real-time project collaboration dashboard using React, TypeScript, and FastAPI WebSockets."
    },
    {
        "filename": "candidate_3_carol_ml_specialist.pdf",
        "name": "Carol Danvers",
        "title": "Machine Learning & AI Engineer",
        "contact": "carol.danvers@example.com | (555) 345-6789 | Boston, MA | carol-ai.io",
        "summary": "Machine Learning Engineer with 3.5 years of experience developing deep learning models, NLP pipelines, and Python microservices. Strong foundation in PyTorch, Scikit-learn, and data engineering.",
        "skills": "Python, PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, FastAPI, Docker, NLP, LLMs, PostgreSQL, Git, Linux",
        "experience": [
            {
                "role": "Machine Learning Engineer - Cognitive Analytics",
                "dates": "2021 - Present (3.0 years)",
                "bullets": [
                    "Developed and deployed transformer-based NLP models for automated document classification.",
                    "Built FastAPI model inference microservice wrapped in Docker containers on GPU instances."
                ]
            },
            {
                "role": "Data Science Associate - Insight Dynamics",
                "dates": "2020 - 2021 (1.0 year)",
                "bullets": [
                    "Created automated feature engineering pipelines and statistical reporting using Pandas and NumPy."
                ]
            }
        ],
        "education": "Master of Science in Artificial Intelligence - Massachusetts Institute of Technology (2020)\nBachelor of Science in Mathematics - Boston University (2018)",
        "certifications": "TensorFlow Developer Certificate",
        "projects": "Neural Search Engine: Vector semantic search engine powered by FAISS and PyTorch embeddings."
    },
    {
        "filename": "candidate_4_david_junior_dev.pdf",
        "name": "David Miller",
        "title": "Junior Python Developer",
        "contact": "david.miller@example.com | (555) 456-7890 | Chicago, IL | github.com/davidm",
        "summary": "Ambitious Junior Developer with 1.2 years of internship and junior experience in Python, Flask, HTML, CSS, and basic SQL. Eager to contribute to modern backend applications and learn FastAPI & Docker.",
        "skills": "Python, Flask, SQLite, HTML5, CSS3, JavaScript, Git, Unit Testing",
        "experience": [
            {
                "role": "Junior Python Developer - TechSpark Labs",
                "dates": "2023 - Present (1.2 years)",
                "bullets": [
                    "Maintained internal Flask web tools and updated database queries in SQLite.",
                    "Wrote unit tests achieving 80% coverage on internal utility scripts."
                ]
            }
        ],
        "education": "Bachelor of Science in Information Technology - University of Illinois (2023)",
        "certifications": "Python Institute PCPP1 Certified",
        "projects": "Weather Tracker: Simple CLI & Flask app querying weather APIs with caching."
    },
    {
        "filename": "candidate_5_eve_marketing_manager.pdf",
        "name": "Eve Adams",
        "title": "Senior Growth Marketing Manager",
        "contact": "eve.adams@example.com | (555) 567-8901 | New York, NY",
        "summary": "Creative and analytical Growth Marketing Manager with 5+ years driving user acquisition, content strategy, brand marketing, and Google Ads campaigns for B2B SaaS products.",
        "skills": "Growth Marketing, SEO/SEM, Google Analytics, Content Strategy, Social Media, Email Campaigns, Copywriting, HubSpot, CRM",
        "experience": [
            {
                "role": "Marketing Lead - GrowthWave Media",
                "dates": "2021 - Present (3.0 years)",
                "bullets": [
                    "Managed $500k annual ad budget across Google and LinkedIn, increasing inbound lead flow by 65%.",
                    "Orchestrated multi-channel content marketing campaigns driving 200k monthly organic visits."
                ]
            },
            {
                "role": "Digital Marketing Specialist - BrandBoost Inc",
                "dates": "2019 - 2021 (2.0 years)",
                "bullets": [
                    "Conducted A/B testing on email newsletters and landing pages to optimize conversion funnels."
                ]
            }
        ],
        "education": "Bachelor of Arts in Communications & Marketing - New York University (2019)",
        "certifications": "Google Ads Certified | HubSpot Inbound Marketing",
        "projects": "Brand Launch 2023: Led full rebranding campaign featured in AdWeek."
    }
]


def generate_pdf(cand: dict, filepath: str):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=35,
        bottomMargin=35,
    )
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=2,
    )
    subtitle_style = ParagraphStyle(
        "DocSub",
        parent=styles["Normal"],
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#2563EB"),
        fontName="Helvetica-Bold",
        spaceAfter=4,
    )
    contact_style = ParagraphStyle(
        "DocContact",
        parent=styles["Normal"],
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=12,
    )
    section_heading = ParagraphStyle(
        "SectionHead",
        parent=styles["Heading2"],
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#1E293B"),
        fontName="Helvetica-Bold",
        spaceBefore=8,
        spaceAfter=4,
        borderPadding=2,
    )
    body_style = ParagraphStyle(
        "DocBody",
        parent=styles["Normal"],
        fontSize=9,
        leading=12.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4,
    )
    bullet_style = ParagraphStyle(
        "DocBullet",
        parent=styles["Normal"],
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        leftIndent=12,
        spaceAfter=2,
    )

    story = []

    # Header
    story.append(Paragraph(cand["name"], title_style))
    story.append(Paragraph(cand["title"], subtitle_style))
    story.append(Paragraph(cand["contact"], contact_style))

    # Divider line
    divider = Table([[""]], colWidths=[532], rowHeights=[1.5])
    divider.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#CBD5E1"))]))
    story.append(divider)
    story.append(Spacer(1, 8))

    # Summary
    story.append(Paragraph("PROFESSIONAL SUMMARY", section_heading))
    story.append(Paragraph(cand["summary"], body_style))
    story.append(Spacer(1, 4))

    # Skills
    story.append(Paragraph("TECHNICAL & CORE SKILLS", section_heading))
    story.append(Paragraph(cand["skills"], body_style))
    story.append(Spacer(1, 4))

    # Experience
    story.append(Paragraph("WORK EXPERIENCE", section_heading))
    for exp in cand["experience"]:
        exp_header = f"<b>{exp['role']}</b> | <i>{exp['dates']}</i>"
        story.append(Paragraph(exp_header, body_style))
        for bullet in exp["bullets"]:
            story.append(Paragraph(f"• {bullet}", bullet_style))
        story.append(Spacer(1, 4))

    # Education
    story.append(Paragraph("EDUCATION", section_heading))
    for edu_line in cand["education"].split("\n"):
        story.append(Paragraph(edu_line, body_style))
    story.append(Spacer(1, 4))

    # Certifications & Projects
    if cand.get("certifications"):
        story.append(Paragraph("CERTIFICATIONS", section_heading))
        story.append(Paragraph(cand["certifications"], body_style))
        story.append(Spacer(1, 4))

    if cand.get("projects"):
        story.append(Paragraph("KEY PROJECTS", section_heading))
        story.append(Paragraph(cand["projects"], body_style))

    doc.build(story)
    print(f"Generated sample PDF: {filepath}")


def main():
    print(f"Generating 5 realistic candidate resumes in {OUTPUT_DIR}...")
    for cand in CANDIDATES:
        out_path = os.path.join(OUTPUT_DIR, cand["filename"])
        generate_pdf(cand, out_path)
    print("All sample PDF resumes generated successfully.")


if __name__ == "__main__":
    main()
