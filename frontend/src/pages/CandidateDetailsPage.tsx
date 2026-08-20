import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bot, Briefcase } from 'lucide-react';
import { CandidateDetail } from '../types/candidate';
import { candidateService } from '../services/candidateService';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { ScoreBreakdownCard } from '../components/common/ScoreBreakdownCard';
import { MatchedSkillsCard } from '../components/candidates/MatchedSkillsCard';
import { ExplanationCard } from '../components/candidates/ExplanationCard';
import { CandidateProfileCard } from '../components/candidates/CandidateProfileCard';
import { RecommendationBadge } from '../components/common/Badge';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';

export const CandidateDetailsPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const numericCandidateId = Number(candidateId);

  useEffect(() => {
    if (numericCandidateId) {
      loadCandidate();
    }
  }, [numericCandidateId]);

  const loadCandidate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await candidateService.getCandidateById(numericCandidateId);
      setCandidate(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load candidate profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading candidate profile & screening results..." />;
  }

  if (error || !candidate) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error || 'Candidate not found'} onRetry={loadCandidate} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  const screening = candidate.screening;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (candidate.job_id) {
              navigate(`/jobs/${candidate.job_id}/rankings`);
            } else {
              navigate(-1);
            }
          }}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            {candidate.job_title
              ? `Back to Rankings for ${candidate.job_title}`
              : 'Back to Rankings'}
          </span>
        </button>

        {candidate.job_id && (
          <Link
            to={`/jobs/${candidate.job_id}`}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Requisition: {candidate.job_title}</span>
          </Link>
        )}
      </div>

      {/* Candidate Score Hero Header */}
      {screening && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <ScoreGauge score={screening.overall_score} size="lg" />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <RecommendationBadge recommendation={screening.recommendation} size="lg" />
                <span className="text-xs text-slate-400 font-medium">
                  • Matched against {candidate.job_title}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit']">
                {candidate.name}
              </h1>
              <p className="text-xs text-slate-400">
                Source Document: <span className="text-slate-300">{candidate.resume_filename}</span>
              </p>
            </div>
          </div>

          <div className="text-right flex flex-col items-center sm:items-end space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Deterministic Overall Score
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 font-['Outfit']">
              {screening.overall_score.toFixed(1)} / 10.0
            </span>
            <span className="text-[11px] text-slate-500">
              Computed via 5 weighted deterministic subscores
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Evaluation Breakdown & Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: AI Analysis, Scoring Breakdown, Matched Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Explanation & Strengths/Gaps */}
          {screening && (
            <ExplanationCard
              recommendation={screening.recommendation}
              explanation={screening.explanation}
              strengths={screening.strengths}
              gaps={screening.gaps}
              llmAssessment={screening.llm_assessment}
            />
          )}

          {/* Matched & Missing Skills */}
          {screening && (
            <MatchedSkillsCard
              matchedSkills={screening.matched_skills}
              missingSkills={screening.missing_skills}
            />
          )}

          {/* Full Experience & Education Profile */}
          <CandidateProfileCard candidate={candidate} />
        </div>

        {/* Right Column: Deterministic Scoring Breakdown Card */}
        <div className="space-y-6">
          {screening ? (
            <ScoreBreakdownCard
              skillScore={screening.skill_score}
              experienceScore={screening.experience_score}
              semanticScore={screening.semantic_score}
              educationScore={screening.education_score}
              certificationScore={screening.certification_score}
              overallScore={screening.overall_score}
            />
          ) : (
            <div className="glass-card rounded-xl p-6 border border-slate-800 text-center text-slate-400">
              <Bot className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Candidate not screened yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
