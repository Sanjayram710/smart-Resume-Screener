import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileUp, Play } from 'lucide-react';
import { Job } from '../types/job';
import { Resume } from '../types/candidate';
import { jobService } from '../services/jobService';
import { resumeService } from '../services/resumeService';
import { screeningService } from '../services/screeningService';
import { ResumeDropzone } from '../components/resumes/ResumeDropzone';
import { ResumeList } from '../components/resumes/ResumeList';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';

export const UploadResumesPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isScreening, setIsScreening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      setError(err.message || 'Failed to load job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await resumeService.uploadResumes(numericJobId, files);
      setSuccessMsg(
        `Successfully uploaded and parsed ${res.total_uploaded} resume(s)!`
      );
      // Reload resumes
      const updated = await resumeService.getResumesByJobId(numericJobId);
      setResumes(updated);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunScreening = async () => {
    setIsScreening(true);
    setError(null);
    try {
      await screeningService.screenJob(numericJobId);
      navigate(`/jobs/${numericJobId}/rankings`);
    } catch (err: any) {
      setError(err.message || 'Screening failed');
      setIsScreening(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading upload portal..." />;
  }

  if (!job) {
    return <ErrorMessage message="Job not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(`/jobs/${job.id}`)}
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Job #{job.id}</span>
      </button>

      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold mb-1">
            <FileUp className="w-4 h-4" />
            <span>Upload Candidate Resumes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-['Outfit']">
            {job.title}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{job.company}</p>
        </div>

        {resumes.length > 0 && (
          <button
            onClick={handleRunScreening}
            disabled={isScreening}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isScreening ? 'Screening...' : `Screen ${resumes.length} Candidate(s)`}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Upload Dropzone */}
      <ResumeDropzone onUpload={handleUpload} isUploading={isUploading} />

      {/* Resumes List */}
      <ResumeList resumes={resumes} />
    </div>
  );
};
