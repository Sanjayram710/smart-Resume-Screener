import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  ChevronRight,
  Clock,
  FileUp,
  HelpCircle,
  Play,
} from 'lucide-react';
import { Job, JobStatus } from '../types/job';
import { Resume } from '../types/candidate';
import { jobService } from '../services/jobService';
import { resumeService } from '../services/resumeService';
import { screeningService } from '../services/screeningService';
import { JobStatusBadge, SkillBadge } from '../components/common/Badge';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import { ResumeList } from '../components/resumes/ResumeList';
import { ScoringMethodologyModal } from '../components/common/ScoringMethodologyModal';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreening, setIsScreening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

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

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!job) return;
    try {
      await jobService.updateJob(job.id, { status: newStatus });
      setJob({ ...job, status: newStatus });
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
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
          className="text-xs text-[#EA580C] hover:underline flex items-center space-x-1 font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  const hasScreened = (job.screened_count || 0) > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4A3520] hover:text-[#2A1B0F] clay-btn-secondary"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header Card (Molded Warm Clay Requisition Header) */}
      <div className="clay-card rounded-[32px] p-7 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FFFCF7] border border-[#F0E4D3]">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <JobStatusBadge status={job.status || 'Open'} size="md" />
            <select
              value={job.status || 'Open'}
              onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
              className="clay-inset text-[#2A1B0F] text-xs font-bold rounded-full px-3 py-1 focus:outline-none cursor-pointer border-[#EBDCC4]"
            >
              <option value="Open" className="bg-[#FFFCF7] text-[#2A1B0F]">Status: Open</option>
              <option value="Paused" className="bg-[#FFFCF7] text-[#2A1B0F]">Status: Paused</option>
              <option value="Closed" className="bg-[#FFFCF7] text-[#2A1B0F]">Status: Closed</option>
            </select>
            <span className="text-xs text-[#8B7355] font-mono font-bold">Job #{job.id}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B553F]">
            <span className="flex items-center space-x-1.5 text-[#4A3520] font-bold">
              <Building className="w-4 h-4 text-[#8B7355]" />
              <span>{job.company}</span>
            </span>
            <span className="text-[#C5B49F]">•</span>
            <span className="flex items-center space-x-1.5 text-[#6B553F] font-semibold">
              <Clock className="w-4 h-4 text-[#8B7355]" />
              <span>{job.minimum_experience} Years Minimum Experience</span>
            </span>
            <span className="text-[#C5B49F]">•</span>
            <span className="flex items-center space-x-1.5 text-[#C2410C] font-extrabold">
              <FileUp className="w-4 h-4 text-[#EA580C]" />
              <span>{resumes.length} Uploaded Resumes</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMethodologyOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-[#4A3520] hover:text-[#2A1B0F] clay-btn-secondary flex items-center space-x-1.5"
          >
            <HelpCircle className="w-4 h-4 text-[#EA580C]" />
            <span>Scoring Model</span>
          </button>

          <Link
            to={`/jobs/${job.id}/upload`}
            className="px-4 py-2.5 text-xs font-bold text-[#4A3520] hover:text-[#2A1B0F] clay-btn-secondary flex items-center space-x-2"
          >
            <FileUp className="w-4 h-4 text-[#EA580C]" />
            <span>Upload Resumes</span>
          </Link>

          <button
            onClick={handleRunScreening}
            disabled={isScreening || resumes.length === 0}
            className="px-5 py-2.5 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
            title={resumes.length === 0 ? 'Upload resumes before running screening' : 'Screen candidates'}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isScreening ? 'Screening Candidates...' : 'Run Candidate Screening'}</span>
          </button>

          {hasScreened ? (
            <Link
              to={`/jobs/${job.id}/rankings`}
              className="px-4 py-2.5 text-xs font-bold text-[#4A3520] hover:text-[#2A1B0F] clay-btn-secondary flex items-center space-x-1.5"
            >
              <span>View Leaderboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="px-4 py-2.5 rounded-full bg-[#F1E5D4] text-[#8C7660] text-xs font-bold border border-[#DFCCA8] cursor-not-allowed flex items-center space-x-1.5"
              title="No candidates screened yet"
            >
              <span>View Leaderboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C7660]" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Requirements and Job Spec */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Required & Preferred */}
          <div className="clay-card rounded-[28px] p-7 space-y-5 bg-[#FFFCF7] border border-[#F0E4D3]">
            <h3 className="text-sm font-extrabold text-[#2A1B0F] uppercase tracking-wider font-['Outfit']">
              Skills & Qualifications
            </h3>

            <div>
              <p className="text-xs font-bold text-[#6B553F] mb-2.5">Mandatory Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill: string) => (
                  <SkillBadge key={skill} skill={skill} type="required" />
                ))}
              </div>
            </div>

            {job.preferred_skills && job.preferred_skills.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#6B553F] mb-2.5">Preferred / Bonus Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.preferred_skills.map((skill: string) => (
                    <SkillBadge key={skill} skill={skill} type="preferred" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Job Description Text */}
          <div className="clay-card rounded-[28px] p-7 space-y-3 bg-[#FFFCF7] border border-[#F0E4D3]">
            <h3 className="text-sm font-extrabold text-[#2A1B0F] uppercase tracking-wider font-['Outfit']">
              Full Job Description
            </h3>
            <div className="text-xs text-[#6B553F] leading-relaxed whitespace-pre-line font-medium">
              {job.description}
            </div>
          </div>
        </div>

        {/* Right Column: Resumes and Screen Status */}
        <div className="space-y-6">
          <ResumeList resumes={resumes} />
        </div>
      </div>

      {/* Scoring Methodology Modal */}
      <ScoringMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
};
