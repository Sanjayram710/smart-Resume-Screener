"""initial_schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-08-20 12:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. jobs
    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("required_skills", sa.JSON(), nullable=False),
        sa.Column("preferred_skills", sa.JSON(), nullable=False),
        sa.Column("minimum_experience", sa.Float(), nullable=False),
        sa.Column("education_requirements", sa.JSON(), nullable=False),
        sa.Column("certifications", sa.JSON(), nullable=False),
        sa.Column("keywords", sa.JSON(), nullable=False),
        sa.Column("responsibilities", sa.JSON(), nullable=False),
        sa.Column("important_requirements", sa.JSON(), nullable=False),
        sa.Column("nice_to_have_requirements", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_jobs_id"), "jobs", ["id"], unique=False)
    op.create_index(op.f("ix_jobs_title"), "jobs", ["title"], unique=False)
    op.create_index(op.f("ix_jobs_company"), "jobs", ["company"], unique=False)

    # 2. resumes
    op.create_table(
        "resumes",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("raw_text", sa.Text(), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(), nullable=False),
        sa.Column("processing_status", sa.String(length=50), nullable=False),
        sa.Column("file_hash", sa.String(length=64), nullable=False),
        sa.Column("file_path", sa.String(length=500), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_resumes_id"), "resumes", ["id"], unique=False)
    op.create_index(op.f("ix_resumes_job_id"), "resumes", ["job_id"], unique=False)
    op.create_index(op.f("ix_resumes_file_hash"), "resumes", ["file_hash"], unique=False)
    op.create_index(
        op.f("ix_resumes_processing_status"), "resumes", ["processing_status"], unique=False
    )

    # 3. candidates
    op.create_table(
        "candidates",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("resume_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=50), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("skills", sa.JSON(), nullable=False),
        sa.Column("technical_skills", sa.JSON(), nullable=False),
        sa.Column("soft_skills", sa.JSON(), nullable=False),
        sa.Column("education", sa.JSON(), nullable=False),
        sa.Column("experience", sa.JSON(), nullable=False),
        sa.Column("certifications", sa.JSON(), nullable=False),
        sa.Column("projects", sa.JSON(), nullable=False),
        sa.Column("years_of_experience", sa.Float(), nullable=False),
        sa.Column("embedding_vector", sa.JSON(), nullable=True),
        sa.Column("extraction_warnings", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["resume_id"], ["resumes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("resume_id"),
    )
    op.create_index(op.f("ix_candidates_id"), "candidates", ["id"], unique=False)
    op.create_index(op.f("ix_candidates_name"), "candidates", ["name"], unique=False)
    op.create_index(op.f("ix_candidates_email"), "candidates", ["email"], unique=False)

    # 4. screenings
    op.create_table(
        "screenings",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("candidate_id", sa.Integer(), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=False),
        sa.Column("skill_score", sa.Float(), nullable=False),
        sa.Column("experience_score", sa.Float(), nullable=False),
        sa.Column("education_score", sa.Float(), nullable=False),
        sa.Column("certification_score", sa.Float(), nullable=False),
        sa.Column("semantic_score", sa.Float(), nullable=False),
        sa.Column("recommendation", sa.String(length=50), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.Column("strengths", sa.JSON(), nullable=False),
        sa.Column("gaps", sa.JSON(), nullable=False),
        sa.Column("llm_assessment", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["candidate_id"], ["candidates.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_screenings_id"), "screenings", ["id"], unique=False)
    op.create_index(op.f("ix_screenings_job_id"), "screenings", ["job_id"], unique=False)
    op.create_index(
        op.f("ix_screenings_candidate_id"), "screenings", ["candidate_id"], unique=False
    )
    op.create_index(
        op.f("ix_screenings_overall_score"), "screenings", ["overall_score"], unique=False
    )
    op.create_index(
        op.f("ix_screenings_recommendation"), "screenings", ["recommendation"], unique=False
    )

    # 5. matched_skills
    op.create_table(
        "matched_skills",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("screening_id", sa.Integer(), nullable=False),
        sa.Column("skill", sa.String(length=255), nullable=False),
        sa.Column("match_type", sa.String(length=50), nullable=False),
        sa.Column("similarity_score", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(["screening_id"], ["screenings.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_matched_skills_id"), "matched_skills", ["id"], unique=False)
    op.create_index(
        op.f("ix_matched_skills_screening_id"), "matched_skills", ["screening_id"], unique=False
    )

    # 6. missing_skills
    op.create_table(
        "missing_skills",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("screening_id", sa.Integer(), nullable=False),
        sa.Column("skill", sa.String(length=255), nullable=False),
        sa.Column("importance", sa.String(length=50), nullable=False),
        sa.ForeignKeyConstraint(["screening_id"], ["screenings.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_missing_skills_id"), "missing_skills", ["id"], unique=False)
    op.create_index(
        op.f("ix_missing_skills_screening_id"), "missing_skills", ["screening_id"], unique=False
    )


def downgrade() -> None:
    op.drop_table("missing_skills")
    op.drop_table("matched_skills")
    op.drop_table("screenings")
    op.drop_table("candidates")
    op.drop_table("resumes")
    op.drop_table("jobs")
