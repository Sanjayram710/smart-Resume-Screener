import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Briefcase, CheckCircle2, FileText, PlusCircle, Sparkles } from 'lucide-react';
import { JobSummary } from '../types/job';
import { jobService } from '../services/jobService';
import { JobCard } from '../components/jobs/JobCard';
import { StatsCard } from '../components/common/StatsCard';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
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

  // Compute aggregate statistics
  const totalJobs = jobs.length;
  const totalResumes = jobs.reduce((acc, j) => acc + (j.resume_count || 0), 0);
  const totalScreened = jobs.reduce((acc, j) => acc + (j.screened_count || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic Scoring & AI Explainability</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            AI Recruiter Intelligence & Candidate Screener
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Screen resumes against job requirements with 6-stage deterministic matching,
            transparent scoring weights, bias redaction, and AI qualitative evaluations.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/jobs/create"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Job</span>
            </Link>
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
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <StatsCard
          title="Resumes Uploaded"
          value={totalResumes}
          subtitle="PDF & TXT documents"
          icon={FileText}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <StatsCard
          title="Candidates Screened"
          value={totalScreened}
          subtitle="AI & deterministic scored"
          icon={Bot}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <StatsCard
          title="Engine Status"
          value="Active (Mock/Local)"
          subtitle="Zero-cost offline mode"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          badge={{ text: "Ready", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" }}
        />
      </div>

      {/* Jobs Listing Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-['Outfit']">
              Job Postings & Screeners
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a job to inspect candidate rankings or upload new batches of resumes
            </p>
          </div>
          <Link
            to="/jobs/create"
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Job</span>
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading active job postings..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchJobs} />
        ) : jobs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 text-slate-400 space-y-3">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No Job Postings Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first job description to start uploading resumes and ranking candidates.
            </p>
            <Link
              to="/jobs/create"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-md mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Job</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
