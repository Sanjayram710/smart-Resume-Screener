export interface MatchedSkill {
  id?: number;
  skill: string;
  match_type: 'EXACT' | 'SEMANTIC' | 'PARTIAL';
  similarity_score: number;
}

export interface MissingSkill {
  id?: number;
  skill: string;
  importance: 'REQUIRED' | 'PREFERRED';
}

export interface CandidateRankingItem {
  rank: number;
  candidate_id: number;
  screening_id: number;
  candidate_name: string;
  candidate_email?: string;
  resume_id: number;
  resume_filename: string;
  overall_score: number;
  skill_score: number;
  experience_score: number;
  education_score: number;
  certification_score: number;
  semantic_score: number;
  recommendation: 'SHORTLIST' | 'REVIEW' | 'NOT_RECOMMENDED';
  years_of_experience: number;
  matched_skills_count: number;
  missing_skills_count: number;
  top_skills: string[];
  top_strengths: string[];
  explanation_snippet: string;
}

export interface JobScreeningResult {
  job_id: number;
  job_title: string;
  company: string;
  total_candidates: number;
  screened_candidates_count: number;
  shortlisted_count: number;
  review_count: number;
  not_recommended_count: number;
  rankings: CandidateRankingItem[];
}
