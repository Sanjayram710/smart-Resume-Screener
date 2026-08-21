import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  FileUp,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { JobScreeningResult } from '../types/screening';
import { screeningService } from '../services/screeningService';
import { RankingTable } from '../components/candidates/RankingTable';
import { StatsCard } from '../components/common/StatsCard';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';

export const CandidateRankingsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<JobScreeningResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreening, setIsScreening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericJobId = Number(jobId);

  useEffect(() => {
    if (numericJobId) {
      loadRankings();
    }
  }, [numericJobId]);

  const loadRankings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await screeningService.getRankings(numericJobId);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load candidate rankings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReScreen = async () => {
    setIsScreening(true);
    setError(null);
    try {
      const data = await screeningService.screenJob(numericJobId);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Screening recalculation failed');
    } finally {
      setIsScreening(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Calculating deterministic rankings & AI insights..." />;
  }

  if (error || !result) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error || 'Rankings not found'} onRetry={loadRankings} />
        <button
          onClick={() => navigate('/')}
          className="text-xs text-[#EA580C] hover:underline flex items-center space-x-1 font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/jobs/${result.job_id}`)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4A3520] hover:text-[#2A1B0F] clay-btn-secondary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Job #{result.job_id}</span>
        </button>

        <div className="flex items-center space-x-3">
          <Link
            to={`/jobs/${result.job_id}/upload`}
            className="px-4 py-2 text-xs font-bold text-[#4A3520] hover:text-[#2A1B0F] clay-btn-secondary flex items-center space-x-1.5"
          >
            <FileUp className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Upload More</span>
          </Link>
          <button
            onClick={handleReScreen}
            disabled={isScreening}
            className="px-5 py-2 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-1.5 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isScreening ? 'animate-spin' : ''}`} />
            <span>{isScreening ? 'Re-scoring...' : 'Re-run Screening'}</span>
          </button>
        </div>
      </div>

      {/* Header Requisition Summary */}
      <div className="clay-card rounded-[28px] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFCF7] border border-[#F0E4D3]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#C2410C] mb-1.5">
            <div className="p-1.5 rounded-xl bg-[#FFEDD5] clay-icon-blob">
              <Trophy className="w-4 h-4 text-[#EA580C]" />
            </div>
            <span>Candidate Leaderboard & Deterministic Rankings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight">
            {result.job_title}
          </h1>
          <p className="text-xs text-[#6B553F] mt-1 font-medium">{result.company}</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Evaluated"
          value={result.screened_candidates_count}
          subtitle="Processed candidates"
          icon={Users}
          iconColor="text-[#6B553F]"
          iconBg="bg-[#F5EAD9]"
        />
        <StatsCard
          title="Shortlisted"
          value={result.shortlisted_count}
          subtitle="Score ≥ 7.0 (High Match)"
          icon={CheckCircle2}
          iconColor="text-[#15803D]"
          iconBg="bg-[#DCFCE7]"
        />
        <StatsCard
          title="Review Required"
          value={result.review_count}
          subtitle="Score 5.0 – 6.9 (Partial Match)"
          icon={Bot}
          iconColor="text-[#92400E]"
          iconBg="bg-[#FEF3C7]"
        />
        <StatsCard
          title="Not Recommended"
          value={result.not_recommended_count}
          subtitle="Score < 5.0 (Weak Match)"
          icon={Sparkles}
          iconColor="text-[#991B1B]"
          iconBg="bg-[#FEE2E2]"
        />
      </div>

      {/* Leaderboard Table */}
      <RankingTable rankings={result.rankings} />
    </div>
  );
};
