import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  Code,
  Cpu,
  FileText,
  GraduationCap,
  Info,
  Layers,
  PlusCircle,
  Search,
  ShieldCheck,
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
      {/* Hero Welcome Banner (Molded Warm Clay Surface with balanced 6-stage architecture diagram) */}
      <div className="clay-card p-8 sm:p-10 rounded-[32px] relative overflow-hidden bg-[#FFFCF7] border border-[#F0E4D3] shadow-[0_8px_24px_rgba(194,120,3,0.10)]">
        {/* Subtle ambient warm lighting effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FB923C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, high-contrast description, and action buttons */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFEDD5] border border-[#FDBA74] text-[#C2410C] text-xs font-extrabold clay-badge">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deterministic Scoring & AI Explainability</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight leading-tight">
              AI Recruiter Intelligence & Candidate Screener
            </h1>

            <p className="text-sm sm:text-base text-[#5A4232] leading-relaxed font-semibold">
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
                className="px-5 py-3 text-xs font-extrabold text-[#9A3412] hover:text-[#7C2D12] clay-btn-secondary flex items-center space-x-2 border border-[#DFCCA8]"
              >
                <Layers className="w-4 h-4 text-[#C2410C]" />
                <span>View Scoring Methodology (6 Stages)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Balanced 6-Stage Scoring Architecture Preview */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="p-5 rounded-3xl bg-[#FAF3E7]/90 border border-[#F0E4D3] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),0_4px_16px_rgba(180,110,40,0.06)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E4D3]/70">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9A3412] flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>6-Stage Architecture</span>
                </span>
                <span className="text-[10px] font-bold text-[#8B7355] bg-[#F5EAD9] px-2 py-0.5 rounded-full border border-[#EBDCC4]">
                  Deterministic
                </span>
              </div>

              {/* 6 Stage Mini Cards Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-2xl bg-[#FFFCF7] border border-[#F0E4D3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-[#FFEDD5] flex items-center justify-center text-[#EA580C] shrink-0">
                      <Code className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#2A1B0F] truncate">Skills</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#C2410C] bg-[#FFEDD5] px-1.5 py-0.5 rounded-full">40%</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#FFFCF7] border border-[#F0E4D3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#B45309] shrink-0">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#2A1B0F] truncate">Seniority</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.5 rounded-full">25%</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#FFFCF7] border border-[#F0E4D3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-[#FDE4D0] flex items-center justify-center text-[#C2410C] shrink-0">
                      <Brain className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#2A1B0F] truncate">Semantic</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#C2410C] bg-[#FDE4D0] px-1.5 py-0.5 rounded-full">20%</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#FFFCF7] border border-[#F0E4D3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-[#FDE9C8] flex items-center justify-center text-[#92400E] shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#2A1B0F] truncate">Degree</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#92400E] bg-[#FDE9C8] px-1.5 py-0.5 rounded-full">10%</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#FFFCF7] border border-[#F0E4D3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-[#FFEDD5] flex items-center justify-center text-[#EA580C] shrink-0">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#2A1B0F] truncate">Certs</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#C2410C] bg-[#FFEDD5] px-1.5 py-0.5 rounded-full">5%</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#FFFCF7] border border-[#F0E4D3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#15803D] shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#2A1B0F] truncate">Redaction</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.5 rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row - Unified Cohesive Warm Palette & Elevated Shadow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Active Jobs"
          value={totalJobs}
          subtitle="Open requisition profiles"
          icon={Briefcase}
          iconColor="text-[#EA580C]"
          iconBg="bg-[#FFEDD5]"
        />
        <StatsCard
          title="Resumes Uploaded"
          value={totalResumes}
          subtitle="PDF & TXT documents"
          icon={FileText}
          iconColor="text-[#B45309]"
          iconBg="bg-[#FEF3C7]"
        />
        <StatsCard
          title="Candidates Screened"
          value={totalScreened}
          subtitle="AI & deterministic scored"
          icon={Bot}
          iconColor="text-[#C2410C]"
          iconBg="bg-[#FDE4D0]"
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
            iconColor="text-[#92400E]"
            iconBg="bg-[#FDE9C8]"
            badge={{
              text: isMockEngine ? 'MOCK MODE' : 'LIVE API',
              color: isMockEngine
                ? 'bg-[#FEF3C7] text-[#92400E] border-2 border-[#D97706]/70 shadow-sm font-extrabold'
                : 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-extrabold',
            }}
          />
        </div>
      </div>

      {/* Engine Status Notice Banner if in Mock Mode */}
      {isMockEngine && (
        <div className="p-4 rounded-[24px] clay-card bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-between gap-3 text-xs text-[#7C2D12]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-[#FFEDD5] clay-icon-blob flex-shrink-0">
              <Info className="w-4 h-4 text-[#EA580C]" />
            </div>
            <span>
              <strong className="text-[#9A3412] font-extrabold">Offline Mock Engine Active:</strong> Match scores and formulas calculate locally using deterministic algorithms without consuming OpenAI API credits.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsEngineModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-[#FFEDD5] hover:bg-[#FDBA74]/40 text-[#C2410C] font-extrabold text-[11px] clay-badge border-[#FDBA74] transition-colors flex-shrink-0"
          >
            Engine Details
          </button>
        </div>
      )}

      {/* Jobs Listing Section with Search, Filter, Sort Controls */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight">
              Job Postings & Screeners
            </h2>
            <p className="text-xs text-[#6B553F] mt-1 font-medium">
              Select a job to inspect candidate rankings, manage status, or upload resumes
            </p>
          </div>

          <Link
            to="/jobs/create"
            className="self-start sm:self-auto px-4 py-2 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Job</span>
          </Link>
        </div>

        {/* Search & Filter Toolbar (Clay Container + Inset Controls) */}
        <div className="clay-card p-5 rounded-[28px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input (Recessed Inset Clay) */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8B7355] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, or required skill..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full clay-inset text-[#2A1B0F] text-xs placeholder:text-[#8B7355] focus:outline-none focus:border-[#FDBA74] transition-colors font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#2A1B0F]"
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
                        : 'text-[#6B553F] hover:text-[#2A1B0F]'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 clay-inset rounded-full px-3.5 py-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B7355]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-[#2A1B0F] text-xs font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="recent" className="bg-[#FFFCF7] text-[#2A1B0F]">
                  Most Recent
                </option>
                <option value="screened" className="bg-[#FFFCF7] text-[#2A1B0F]">
                  Most Screened
                </option>
                <option value="resumes" className="bg-[#FFFCF7] text-[#2A1B0F]">
                  Most Resumes
                </option>
                <option value="alphabetical" className="bg-[#FFFCF7] text-[#2A1B0F]">
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
          <div className="clay-card rounded-[32px] p-12 text-center text-[#6B553F] space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-[#F5EAD9] clay-icon-blob flex items-center justify-center mx-auto text-[#EA580C]">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#2A1B0F] font-['Outfit']">No Job Postings Found</h3>
            <p className="text-xs text-[#6B553F] max-w-sm mx-auto">
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
          <div className="clay-card rounded-[32px] p-10 text-center text-[#6B553F] space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-[#F5EAD9] clay-icon-blob flex items-center justify-center mx-auto text-[#EA580C]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#2A1B0F] font-['Outfit']">No Matching Jobs</h3>
            <p className="text-xs text-[#6B553F] max-w-sm mx-auto">
              No job postings matched your search filter "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="px-4 py-2 text-xs font-bold text-[#4A3520] clay-btn-secondary"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md clay-card bg-[#FFFCF7] p-7 space-y-5 shadow-[0_25px_60px_rgba(180,110,40,0.25)] border border-[#F0E4D3]">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFEDD5] clay-icon-blob text-[#EA580C] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#2A1B0F] font-['Outfit']">
                    AI Evaluation Engine
                  </h3>
                  <p className="text-xs text-[#6B553F]">
                    System runtime and provider configuration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEngineModalOpen(false)}
                className="p-1 text-[#6B553F] hover:text-[#2A1B0F] clay-btn-secondary rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl clay-inset text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B553F]">Active Mode:</span>
                <span className="font-bold text-[#C2410C] uppercase font-mono">
                  {engineHealth?.llm_mode || 'mock'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B553F]">Database Connection:</span>
                <span className="font-bold text-[#15803D]">Connected (Healthy)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B553F]">Deterministic Engine:</span>
                <span className="font-bold text-[#2A1B0F]">6-Stage Mathematical</span>
              </div>
            </div>

            <div className="text-xs text-[#6B553F] space-y-2 leading-relaxed font-medium">
              <p>
                <strong className="text-[#2A1B0F]">Offline Mock Mode (Current):</strong> Scores are computed with the 100% deterministic mathematical model (Skills 40%, Experience 25%, Vectors 20%, Education 10%, Certs 5%). Qualitative notes use deterministic synthesis.
              </p>
              <p className="text-[#8B7355] text-[11px]">
                To enable live OpenAI generation, set <code className="text-[#C2410C] font-mono bg-[#FFEDD5] px-1.5 py-0.5 rounded-full border border-[#FDBA74]">LLM_MODE=real</code> and provide <code className="text-[#C2410C] font-mono bg-[#FFEDD5] px-1.5 py-0.5 rounded-full border border-[#FDBA74]">OPENAI_API_KEY</code> in <code className="text-[#2A1B0F]">.env</code>.
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
