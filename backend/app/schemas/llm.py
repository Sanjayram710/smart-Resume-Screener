from typing import List, Optional

from pydantic import BaseModel, Field


class EducationItem(BaseModel):
    degree: str = Field(
        ..., description="Degree or qualification name (e.g. B.S. in Computer Science)"
    )
    institution: Optional[str] = Field(None, description="University or institution name")
    field_of_study: Optional[str] = Field(None, description="Field of study or major")
    graduation_year: Optional[str] = Field(None, description="Year or expected year of graduation")


class ExperienceItem(BaseModel):
    title: str = Field(..., description="Job or role title")
    company: Optional[str] = Field(None, description="Company or organization name")
    duration: Optional[str] = Field(None, description="Duration (e.g. 2021 - 2024 or 3 years)")
    years: float = Field(0.0, description="Estimated duration in years for this position")
    responsibilities: List[str] = Field(
        default_factory=list, description="Key duties and achievements"
    )
    technologies: List[str] = Field(
        default_factory=list, description="Technologies or tools used in this role"
    )


class ProjectItem(BaseModel):
    name: str = Field(..., description="Project name")
    description: Optional[str] = Field(None, description="Brief summary of the project")
    technologies: List[str] = Field(
        default_factory=list, description="Technologies utilized in this project"
    )
    link: Optional[str] = Field(None, description="Repository or live URL if mentioned")


class ResumeExtractionOutput(BaseModel):
    name: Optional[str] = Field("Anonymous Candidate", description="Candidate's full name")
    email: Optional[str] = Field(None, description="Candidate's email address")
    phone: Optional[str] = Field(None, description="Candidate's phone number")
    summary: Optional[str] = Field(None, description="Professional summary or bio")

    skills: List[str] = Field(default_factory=list, description="All identified skills")
    technical_skills: List[str] = Field(default_factory=list, description="Hard / technical skills")
    soft_skills: List[str] = Field(
        default_factory=list, description="Soft skills / communication / leadership"
    )

    education: List[EducationItem] = Field(
        default_factory=list, description="Educational background"
    )
    work_experience: List[ExperienceItem] = Field(
        default_factory=list, description="Work experience items"
    )
    certifications: List[str] = Field(
        default_factory=list, description="Licenses and certifications"
    )
    projects: List[ProjectItem] = Field(
        default_factory=list, description="Personal or professional projects"
    )

    years_of_experience: float = Field(
        0.0, description="Total verified years of professional experience"
    )
    explicit_skills: List[str] = Field(
        default_factory=list, description="Skills explicitly listed in the resume"
    )
    inferred_skills: List[str] = Field(
        default_factory=list, description="Skills inferred from project/work context"
    )
    extraction_warnings: List[str] = Field(
        default_factory=list, description="Noteworthy ambiguities or missing sections"
    )


class JobExtractionOutput(BaseModel):
    job_title: str = Field(..., description="Target job title")
    company: str = Field(..., description="Hiring company name")
    required_skills: List[str] = Field(
        default_factory=list, description="Must-have technical and professional skills"
    )
    preferred_skills: List[str] = Field(
        default_factory=list, description="Nice-to-have or preferred skills"
    )
    responsibilities: List[str] = Field(
        default_factory=list, description="Core responsibilities and duties"
    )
    minimum_experience: float = Field(0.0, description="Minimum years of experience required")
    education_requirements: List[str] = Field(
        default_factory=list, description="Required education level (e.g. Bachelor's)"
    )
    certifications: List[str] = Field(
        default_factory=list, description="Desired or required certifications"
    )
    keywords: List[str] = Field(
        default_factory=list, description="Key domain concepts and buzzwords"
    )
    important_requirements: List[str] = Field(
        default_factory=list, description="Critical operational requirements"
    )
    nice_to_have_requirements: List[str] = Field(
        default_factory=list, description="Optional bonus points"
    )
    extraction_warnings: List[str] = Field(
        default_factory=list, description="Any ambiguities in the job description"
    )


class CandidateEvaluationOutput(BaseModel):
    candidate_name: str = Field(..., description="Name of candidate evaluated")
    overall_assessment: str = Field(
        ..., description="High-level qualitative summary of candidate fit"
    )
    strengths: List[str] = Field(
        default_factory=list, description="Top positive qualifications and matches"
    )
    missing_skills: List[str] = Field(
        default_factory=list, description="Required skills not found in candidate profile"
    )
    partial_matches: List[str] = Field(
        default_factory=list,
        description="Skills where candidate has adjacent or partial background",
    )
    experience_assessment: str = Field(
        ..., description="Qualitative critique of career progression and seniority"
    )
    education_assessment: str = Field(..., description="Qualitative critique of academic relevance")
    certification_assessment: str = Field(..., description="Qualitative critique of certifications")
    recommendation: str = Field(..., description="SHORTLIST | REVIEW | NOT_RECOMMENDED")
    justification: str = Field(..., description="Clear evidence-based rationale for the assessment")
    confidence_notes: Optional[str] = Field(None, description="Notes on data certainty or caveats")
