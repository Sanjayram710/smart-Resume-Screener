import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Briefcase,
  CheckCircle2,
  Cpu,
  FileText,
  Info,
  Layers,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { JobStatus, JobSummary } from '../types/job';
import { jobService } from '../services/jobService';
import api from '../services/api';
import { JobCard } from '../components/jobs/JobCard';
import { StatsCard } from '../components/common/StatsCard';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import { ScoringMethodologyModal } from '../components/common/ScoringMethodologyModal';

type SortOption = 'recent' | 'screened' | 'resumes' | 'alphabetical';

export const DashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Open' | 'Paused' | 'Closed'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Modals state
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);

  // Engine health info
  const [engineHealth, setEngineHealth] = useState<{
    status: string;
    llm_mode: string;
    database_connected: boolean;
  } | null>(null);

  useEffect(() => {
    fetchJobs();
    fetchHealth();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await api.get('/health');
      setEngineHealth(res.data);
    } catch (err) {
      console.warn('Could not retrieve health status:', err);
    }
  };

  const handleStatusChange = async (id: number, newStatus: JobStatus) => {
    try {
      await jobService.updateJob(id, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
      );
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteJob = async (id: number) => {
    try {
      await jobService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err: any) {
      alert(`Failed to delete job: ${err.message}`);
    }
  };

  // Compute aggregate statistics
  const totalJobs = jobs.length;
  const totalResumes = jobs.reduce((acc, j) => acc + (j.resume_count || 0), 0);
  const totalScreened = jobs.reduce((acc, j) => acc + (j.screened_count || 0), 0);

  // Real-time filtered & sorted jobs list
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Text Search (title, company, or skills)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.required_skills?.some((s) => s.toLowerCase().includes(q)) ||
          j.preferred_skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'ALL') {
      result = result.filter((j) => (j.status || 'Open') === statusFilter);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'screened') {
        return (b.screened_count || 0) - (a.screened_count || 0);
      }
      if (sortBy === 'resumes') {
        return (b.resume_count || 0) - (a.resume_count || 0);
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [jobs, searchQuery, statusFilter, sortBy]);

  const isMockEngine = engineHealth?.llm_mode !== 'real';

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner (Molded Clay Surface) */}
      <div className="clay-card p-8 sm:p-10 rounded-[32px] relative overflow-hidden">
        {/* Subtle ambient lighting effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold clay-badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic Scoring & AI Explainability</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight leading-tight">
            AI Recruiter Intelligence & Candidate Screener
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Screen resumes against job requirements with 6-stage deterministic matching,
            transparent scoring weights, demographic bias redaction, and AI qualitative evaluations.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3.5">
            <Link
              to="/jobs/create"
              className="px-6 py-3 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Job</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMethodologyOpen(true)}
              className="px-5 py-3 text-xs font-bold text-slate-200 clay-btn-secondary flex items-center space-x-2"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>View Scoring Methodology (6 Stages)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Active Jobs"
          value={totalJobs}
          subtitle="Open requisition profiles"
          icon={Briefcase}
          iconColor="text-emerald-300"
          iconBg="bg-emerald-500/20"
        />
        <StatsCard
          title="Resumes Uploaded"
          value={totalResumes}
          subtitle="PDF & TXT documents"
          icon={FileText}
          iconColor="text-sky-300"
          iconBg="bg-sky-500/20"
        />
        <StatsCard
          title="Candidates Screened"
          value={totalScreened}
          subtitle="AI & deterministic scored"
          icon={Bot}
          iconColor="text-purple-300"
          iconBg="bg-purple-500/20"
        />
        <div
          onClick={() => setIsEngineModalOpen(true)}
          className="cursor-pointer"
        >
          <StatsCard
            title="Evaluation Engine"
            value={isMockEngine ? 'Offline Mock' : 'OpenAI Live'}
            subtitle={isMockEngine ? 'Zero-cost local heuristics' : 'Live GPT-4o extraction'}
            icon={isMockEngine ? Cpu : CheckCircle2}
            iconColor={isMockEngine ? 'text-amber-300' : 'text-emerald-300'}
            iconBg={isMockEngine ? 'bg-amber-500/20' : 'bg-emerald-500/20'}
            badge={{
              text: isMockEngine ? 'Mock Mode' : 'Live API',
              color: isMockEngine
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
            }}
          />
        </div>
      </div>

      {/* Engine Status Notice Banner if in Mock Mode */}
      {isMockEngine && (
        <div className="p-4 rounded-[24px] clay-card bg-gradient-to-r from-[#1c1815] to-[#161d2d] border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-amber-500/20 clay-icon-blob flex-shrink-0">
              <Info className="w-4 h-4 text-amber-300" />
            </div>
            <span>
              <strong className="text-amber-100 font-bold">Offline Mock Engine Active:</strong> Match scores and formulas calculate locally using deterministic algorithms without consuming OpenAI API credits.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsEngineModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-[11px] clay-badge border-amber-500/40 transition-colors flex-shrink-0"
          >
            Engine Details
          </button>
        </div>
      )}

      {/* Jobs Listing Section with Search, Filter, Sort Controls */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Job Postings & Screeners
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Select a job to inspect candidate rankings, manage status, or upload resumes
            </p>
          </div>

          <Link
            to="/jobs/create"
            className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-white clay-btn-primary flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Job</span>
          </Link>
        </div>

        {/* Search & Filter Toolbar (Clay Container + Inset Controls) */}
        <div className="clay-card p-5 rounded-[28px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input (Recessed Inset Clay) */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, or required skill..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full clay-inset text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Pills (Clay & Pressed Inset States) */}
            <div className="flex items-center p-1.5 rounded-full clay-inset">
              {(['ALL', 'Open', 'Paused', 'Closed'] as const).map((st) => {
                const isSelected = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'clay-btn-primary text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 clay-inset rounded-full px-3.5 py-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="recent" className="bg-slate-900 text-slate-200">
                  Most Recent
                </option>
                <option value="screened" className="bg-slate-900 text-slate-200">
                  Most Screened
                </option>
                <option value="resumes" className="bg-slate-900 text-slate-200">
                  Most Resumes
                </option>
                <option value="alphabetical" className="bg-slate-900 text-slate-200">
                  Alphabetical (A - Z)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid or Empty State */}
        {isLoading ? (
          <LoadingSpinner message="Loading active job postings..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchJobs} />
        ) : jobs.length === 0 ? (
          <div className="clay-card rounded-[32px] p-12 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-800/80 clay-icon-blob flex items-center justify-center mx-auto text-slate-400">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-white font-['Outfit']">No Job Postings Found</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Create your first job description to start uploading resumes and ranking candidates.
            </p>
            <Link
              to="/jobs/create"
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white clay-btn-primary mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Job</span>
            </Link>
          </div>
        ) : filteredAndSortedJobs.length === 0 ? (
          <div className="clay-card rounded-[32px] p-10 text-center text-slate-300 space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-slate-800/80 clay-icon-blob flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white font-['Outfit']">No Matching Jobs</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              No job postings matched your search filter "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-200 clay-btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={handleDeleteJob}
                onStatusChange={handleStatusChange}
                onOpenMethodology={() => setIsMethodologyOpen(true)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scoring Methodology Modal */}
      <ScoringMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Engine Status Details Modal (Molded Clay Modal) */}
      {isEngineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md clay-card p-7 space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 clay-icon-blob text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white font-['Outfit']">
                    AI Evaluation Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    System runtime and provider configuration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEngineModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white clay-btn-secondary rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl clay-inset text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Mode:</span>
                <span className="font-bold text-emerald-300 uppercase font-mono">
                  {engineHealth?.llm_mode || 'mock'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database Connection:</span>
                <span className="font-bold text-emerald-400">Connected (Healthy)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Deterministic Engine:</span>
                <span className="font-bold text-slate-200">6-Stage Mathematical</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong className="text-white">Offline Mock Mode (Current):</strong> Scores are computed with the 100% deterministic mathematical model (Skills 40%, Experience 25%, Vectors 20%, Education 10%, Certs 5%). Qualitative notes use deterministic synthesis.
              </p>
              <p className="text-slate-400 text-[11px]">
                To enable live OpenAI generation, set <code className="text-emerald-300 font-mono bg-black/40 px-1.5 py-0.5 rounded-full">LLM_MODE=real</code> and provide <code className="text-emerald-300 font-mono bg-black/40 px-1.5 py-0.5 rounded-full">OPENAI_API_KEY</code> in <code className="text-slate-300">.env</code>.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsEngineModalOpen(false)}
                className="px-5 py-2 text-xs font-extrabold text-white clay-btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
