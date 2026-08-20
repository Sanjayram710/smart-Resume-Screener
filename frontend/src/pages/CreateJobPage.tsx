import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { JobCreatePayload } from '../types/job';
import { jobService } from '../services/jobService';
import { JobForm } from '../components/jobs/JobForm';
import { ErrorMessage } from '../components/common/LoadingSpinner';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateJob = async (payload: JobCreatePayload) => {
    setIsLoading(true);
    setError(null);
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
    </div>
  );
};
