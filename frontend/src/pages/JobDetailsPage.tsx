import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  ChevronRight,
  Clock,
  FileUp,
  Play,
} from 'lucide-react';
import { Job } from '../types/job';
import { Resume } from '../types/candidate';
import { jobService } from '../services/jobService';
import { resumeService } from '../services/resumeService';
import { screeningService } from '../services/screeningService';
import { SkillBadge } from '../components/common/Badge';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import { ResumeList } from '../components/resumes/ResumeList';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreening, setIsScreening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericJobId = Number(jobId);

  useEffect(() => {
    if (numericJobId) {
      loadData();
    }
  }, [numericJobId]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [jobData, resumeData] = await Promise.all([
        jobService.getJobById(numericJobId),
        resumeService.getResumesByJobId(numericJobId),
      ]);
      setJob(jobData);
      setResumes(resumeData);
    } catch (err: any) {
      setError(err.message || 'Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunScreening = async () => {
    setIsScreening(true);
    setError(null);
    try {
      await screeningService.screenJob(numericJobId);
      navigate(`/jobs/${numericJobId}/rankings`);
    } catch (err: any) {
      setError(err.message || 'Screening execution failed');
      setIsScreening(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading job requisition details..." />;
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error || 'Job not found'} onRetry={loadData} />
        <button
          onClick={() => navigate('/')}
          className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Requisition
            </span>
            <span className="text-xs text-slate-500 font-mono">Job #{job.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit']">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1 text-slate-300">
              <Building className="w-4 h-4 text-slate-500" />
              <span>{job.company}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{job.minimum_experience} Years Minimum Experience</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <FileUp className="w-4 h-4" />
              <span>{resumes.length} Uploaded Resumes</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/jobs/${job.id}/upload`}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-100 border border-slate-700 transition-all flex items-center space-x-2 shadow-sm"
          >
            <FileUp className="w-4 h-4 text-emerald-400" />
            <span>Upload Resumes</span>
          </Link>

          <button
            onClick={handleRunScreening}
            disabled={isScreening || resumes.length === 0}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isScreening ? 'Screening Candidates...' : 'Run Candidate Screening'}</span>
          </button>

          <Link
            to={`/jobs/${job.id}/rankings`}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-100 border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <span>View Leaderboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Requirements and Job Spec */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Required & Preferred */}
          <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-['Outfit']">
              Skills & Qualifications
            </h3>

            <div>
              <p className="text-xs font-semibold text-slate-300 mb-2">Mandatory Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill: string) => (
                  <SkillBadge key={skill} skill={skill} type="required" />
                ))}
              </div>
            </div>

            {job.preferred_skills && job.preferred_skills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-2">Preferred / Bonus Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.preferred_skills.map((skill: string) => (
                    <SkillBadge key={skill} skill={skill} type="preferred" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Job Description Text */}
          <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-['Outfit']">
              Full Job Description
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>
        </div>

        {/* Right Column: Resumes and Screen Status */}
        <div className="space-y-6">
          <ResumeList resumes={resumes} />
        </div>
      </div>
    </div>
  );
};
