import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUTPUT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), "../sample_data/jobs"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

SAMPLE_JDS = [
    {
        "filename": "senior_backend_engineer_jd.pdf",
        "title": "Senior Backend & Cloud Engineer",
        "company": "Antigravity Technologies",
        "min_exp": "4+ Years Experience Required",
        "location": "San Francisco, CA (Remote / Hybrid)",
        "summary": "We are seeking a high-caliber Senior Backend Engineer to architect, build, and maintain our high-throughput distributed microservices. You will collaborate with product and infrastructure teams to design resilient RESTful APIs, optimize PostgreSQL queries, and deploy containerized services onto AWS.",
        "responsibilities": [
            "Design, implement, and maintain scalable backend microservices using Python, FastAPI, and PostgreSQL.",
            "Architect resilient database schemas, read replicas, and caching strategies using Redis.",
            "Build automated CI/CD deployment pipelines using Docker, Kubernetes, and AWS.",
            "Write comprehensive unit and integration tests with Pytest to ensure 90%+ code coverage.",
            "Collaborate closely with frontend engineers and product teams on API contract designs."
        ],
        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "REST API", "Git"],
        "preferred_skills": ["AWS", "Kubernetes", "Redis", "CI/CD", "Linux", "Microservices"],
        "education": "Bachelor's Degree in Computer Science, Software Engineering, or related STEM field",
    },
    {
        "filename": "ai_ml_engineer_jd.pdf",
        "title": "Machine Learning & NLP Specialist",
        "company": "Cognitive AI Systems",
        "min_exp": "3+ Years Experience Required",
        "location": "New York, NY (Hybrid)",
        "summary": "We are looking for a passionate Machine Learning & NLP Specialist to design and deploy transformer models and embedding retrieval systems into high-throughput production services.",
        "responsibilities": [
            "Train, evaluate, and fine-tune large language models and semantic embedding algorithms.",
            "Build low-latency inference APIs with Python and FastAPI containerized in Docker.",
            "Design vector retrieval pipelines and evaluate candidate matching models.",
            "Collaborate with data engineers on feature store maintenance and data preprocessing."
        ],
        "required_skills": ["Python", "PyTorch", "Scikit-learn", "Machine Learning", "NLP", "FastAPI"],
        "preferred_skills": ["Docker", "Pandas", "NumPy", "AWS", "HuggingFace", "Vector Search"],
        "education": "Master's or Bachelor's Degree in Computer Science, AI, or Data Science",
    },
    {
        "filename": "frontend_engineer_jd.pdf",
        "title": "Senior Frontend & UI Engineer",
        "company": "PixelCraft Studios",
        "min_exp": "3+ Years Experience Required",
        "location": "Austin, TX (Remote)",
        "summary": "Seeking a seasoned Frontend Engineer proficient in React, TypeScript, and modern styling libraries like Tailwind CSS. You will build dynamic recruiter intelligence portals and interactive visual dashboards.",
        "responsibilities": [
            "Architect and maintain modern React applications using TypeScript and Vite.",
            "Implement responsive, accessible, and polished user interfaces using Tailwind CSS.",
            "Collaborate with backend engineers to integrate RESTful API endpoints and websockets.",
            "Optimize frontend bundle sizes, rendering performance, and cross-browser compatibility."
        ],
        "required_skills": ["React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
        "preferred_skills": ["Node.js", "Next.js", "REST API", "Docker", "Vite"],
        "education": "Bachelor's Degree in Computer Science or related degree",
    },
]


def build_jd_pdf(jd):
    filepath = os.path.join(OUTPUT_DIR, jd["filename"])
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "JDTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#2A1B0F"),
        spaceAfter=4,
    )
    meta_style = ParagraphStyle(
        "JDMeta",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#EA580C"),
        spaceAfter=12,
    )
    section_heading = ParagraphStyle(
        "JDSection",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#2A1B0F"),
        spaceBefore=10,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "JDBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#4A3520"),
        spaceAfter=6,
    )
    bullet_style = ParagraphStyle(
        "JDBullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#4A3520"),
        leftIndent=15,
        spaceAfter=3,
    )

    story = []

    # Title & Company Header
    story.append(Paragraph(jd["title"], title_style))
    story.append(Paragraph(f"{jd['company']} • {jd['location']} • {jd['min_exp']}", meta_style))

    # Divider Table
    divider = Table([[""]], colWidths=[530], rowHeights=[2])
    divider.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FDBA74"))]))
    story.append(divider)
    story.append(Spacer(1, 10))

    # Summary
    story.append(Paragraph("About the Position:", section_heading))
    story.append(Paragraph(jd["summary"], body_style))
    story.append(Spacer(1, 6))

    # Key Responsibilities
    story.append(Paragraph("Key Responsibilities:", section_heading))
    for resp in jd["responsibilities"]:
        story.append(Paragraph(f"• {resp}", bullet_style))
    story.append(Spacer(1, 6))

    # Required Skills
    story.append(Paragraph("Mandatory Required Skills:", section_heading))
    story.append(Paragraph(", ".join(jd["required_skills"]), body_style))
    story.append(Spacer(1, 4))

    # Preferred Skills
    story.append(Paragraph("Preferred / Bonus Qualifications:", section_heading))
    story.append(Paragraph(", ".join(jd["preferred_skills"]), body_style))
    story.append(Spacer(1, 4))

    # Education
    story.append(Paragraph("Education Requirements:", section_heading))
    story.append(Paragraph(jd["education"], body_style))

    doc.build(story)
    print(f"Generated JD PDF: {filepath}")


if __name__ == "__main__":
    for jd_item in SAMPLE_JDS:
        build_jd_pdf(jd_item)
    print("All sample JD PDFs created successfully!")
