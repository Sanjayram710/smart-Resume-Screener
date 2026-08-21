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
        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4A3520] hover:text-[#2A1B0F] clay-btn-secondary"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Job #{job.id}</span>
      </button>

      {/* Header (Molded Warm Clay Card) */}
      <div className="clay-card rounded-[28px] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFCF7] border border-[#F0E4D3]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#C2410C] font-bold mb-1.5">
            <div className="p-1.5 rounded-xl bg-[#FFEDD5] clay-icon-blob">
              <FileUp className="w-4 h-4 text-[#EA580C]" />
            </div>
            <span>Upload Candidate Resumes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight">
            {job.title}
          </h1>
          <p className="text-xs text-[#6B553F] mt-1 font-medium">{job.company}</p>
        </div>

        {resumes.length > 0 && (
          <button
            onClick={handleRunScreening}
            disabled={isScreening}
            className="px-6 py-2.5 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-2 shrink-0 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isScreening ? 'Screening...' : `Screen ${resumes.length} Candidate(s)`}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-[22px] clay-card bg-[#DCFCE7] border border-[#86EFAC] text-xs text-[#15803D] font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
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
