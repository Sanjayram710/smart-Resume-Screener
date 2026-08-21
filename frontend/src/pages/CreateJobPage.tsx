import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { JobCreatePayload, JobSummary } from '../types/job';
import { jobService } from '../services/jobService';
import { JobForm } from '../components/jobs/JobForm';
import { ErrorMessage } from '../components/common/LoadingSpinner';
import { DuplicateJobModal } from '../components/jobs/DuplicateJobModal';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [existingJobs, setExistingJobs] = useState<JobSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Duplicate modal states
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateMatch, setDuplicateMatch] = useState<{
    matchedJob: JobSummary;
    reasons: string[];
    payload: JobCreatePayload;
  } | null>(null);

  useEffect(() => {
    jobService
      .getJobs()
      .then((jobs) => setExistingJobs(jobs))
      .catch((err) => console.warn('Could not fetch existing jobs for duplicate check:', err));
  }, []);

  const detectDuplicate = (
    newJob: JobCreatePayload
  ): { isDuplicate: boolean; matchedJob?: JobSummary; reasons: string[] } => {
    const normTitle = newJob.title.trim().toLowerCase();
    const normCompany = newJob.company.trim().toLowerCase();
    const newSkills = new Set(newJob.required_skills.map((s) => s.trim().toLowerCase()));

    for (const existing of existingJobs) {
      const exTitle = existing.title.trim().toLowerCase();
      const exCompany = existing.company.trim().toLowerCase();
      const exSkills = new Set(existing.required_skills.map((s) => s.trim().toLowerCase()));

      const titleMatch = normTitle === exTitle;
      const companyMatch = normCompany === exCompany;

      // Count overlapping skills
      const sharedSkills = [...newSkills].filter((s) => exSkills.has(s));
      const hasSignificantSkillOverlap =
        newSkills.size > 0 &&
        exSkills.size > 0 &&
        sharedSkills.length / Math.min(newSkills.size, exSkills.size) >= 0.6;

      const reasons: string[] = [];
      if (titleMatch && companyMatch) {
        reasons.push(`Identical Title ("${existing.title}") and Company ("${existing.company}")`);
      } else if (titleMatch) {
        reasons.push(`Same Job Title ("${existing.title}")`);
      } else if (companyMatch && hasSignificantSkillOverlap) {
        reasons.push(`Same Company with matching skill profile`);
      }

      if (sharedSkills.length > 0) {
        reasons.push(
          `Shared required skills: ${sharedSkills.slice(0, 4).join(', ')}${
            sharedSkills.length > 4 ? ` (+${sharedSkills.length - 4} more)` : ''
          }`
        );
      }

      // If exact title+company OR (title/company match AND skill overlap)
      if ((titleMatch && companyMatch) || (titleMatch && sharedSkills.length >= 2) || (companyMatch && hasSignificantSkillOverlap)) {
        return { isDuplicate: true, matchedJob: existing, reasons };
      }
    }

    return { isDuplicate: false, reasons: [] };
  };

  const handleCreateJob = async (payload: JobCreatePayload) => {
    // Check for duplicates first
    const dupCheck = detectDuplicate(payload);
    if (dupCheck.isDuplicate && dupCheck.matchedJob) {
      setDuplicateMatch({
        matchedJob: dupCheck.matchedJob,
        reasons: dupCheck.reasons,
        payload,
      });
      setShowDuplicateModal(true);
      return;
    }

    await executeCreateJob(payload);
  };

  const executeCreateJob = async (payload: JobCreatePayload) => {
    setIsLoading(true);
    setError(null);
    setShowDuplicateModal(false);
    try {
      const created = await jobService.createJob(payload);
      navigate(`/jobs/${created.id}/upload`);
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button & Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 font-['Outfit']">
              Create Job Requisition
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Define target skills, experience, and role responsibilities for candidate screening
            </p>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Form */}
      <JobForm onSubmit={handleCreateJob} isLoading={isLoading} />

      {/* Duplicate Warning Modal */}
      {showDuplicateModal && duplicateMatch && (
        <DuplicateJobModal
          isOpen={showDuplicateModal}
          onClose={() => setShowDuplicateModal(false)}
          onConfirm={() => executeCreateJob(duplicateMatch.payload)}
          onViewExisting={(jobId) => navigate(`/jobs/${jobId}`)}
          newJob={duplicateMatch.payload}
          matchedJob={duplicateMatch.matchedJob}
          matchReasons={duplicateMatch.reasons}
        />
      )}
    </div>
  );
};
