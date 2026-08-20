export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience: number;
  education_requirements: string[];
  certifications: string[];
  keywords: string[];
  responsibilities: string[];
  important_requirements: string[];
  nice_to_have_requirements: string[];
  created_at: string;
  updated_at: string;
  resume_count: number;
  candidate_count: number;
  screened_count: number;
}

export interface JobSummary {
  id: number;
  title: string;
  company: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience: number;
  resume_count: number;
  screened_count: number;
  created_at: string;
}

export interface JobCreatePayload {
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience: number;
  education_requirements: string[];
  certifications: string[];
  auto_extract: boolean;
}
