export interface EducationItem {
  degree: string;
  institution?: string;
  field_of_study?: string;
  graduation_year?: string;
}

export interface ExperienceItem {
  title: string;
  company?: string;
  duration?: string;
  years: number;
  responsibilities: string[];
  technologies: string[];
}

export interface ProjectItem {
  name: string;
  description?: string;
  technologies: string[];
  link?: string;
}

export interface Candidate {
  id: number;
  resume_id: number;
  name: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  technical_skills: string[];
  soft_skills: string[];
  years_of_experience: number;
  certifications: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  extraction_warnings: string[];
  created_at: string;
}

export interface CandidateDetail extends Candidate {
  job_id?: number;
  job_title?: string;
  resume_filename?: string;
  screening?: {
    id: number;
    overall_score: number;
    skill_score: number;
    experience_score: number;
    education_score: number;
    certification_score: number;
    semantic_score: number;
    recommendation: 'SHORTLIST' | 'REVIEW' | 'NOT_RECOMMENDED';
    explanation: string;
    strengths: string[];
    gaps: string[];
    llm_assessment: Record<string, any>;
    matched_skills: Array<{
      id: number;
      skill: string;
      match_type: 'EXACT' | 'SEMANTIC' | 'PARTIAL';
      similarity_score: number;
    }>;
    missing_skills: Array<{
      id: number;
      skill: string;
      importance: 'REQUIRED' | 'PREFERRED';
    }>;
    created_at: string;
  };
}

export interface Resume {
  id: number;
  job_id: number;
  filename: string;
  uploaded_at: string;
  processing_status: 'PENDING' | 'PARSED' | 'FAILED' | 'SCREENED';
  file_hash: string;
  error_message?: string;
  candidate_id?: number;
}
