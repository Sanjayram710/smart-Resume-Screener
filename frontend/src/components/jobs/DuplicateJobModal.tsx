import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { JobCreatePayload, JobSummary } from '../../types/job';
import { SkillBadge } from '../common/Badge';

interface DuplicateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onViewExisting?: (jobId: number) => void;
  newJob: JobCreatePayload;
  matchedJob: JobSummary;
  matchReasons: string[];
}

export const DuplicateJobModal: React.FC<DuplicateJobModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onViewExisting,
  newJob,
  matchedJob,
  matchReasons,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl clay-card bg-[#FFFCF7] border border-[#FED7AA] shadow-[0_25px_60px_rgba(180,110,40,0.25)] p-7 space-y-5 rounded-[32px] overflow-hidden">
        {/* Header with warning styling */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] clay-icon-blob text-[#B45309] flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#2A1B0F] font-['Outfit']">
                Similar Job Already Exists
              </h3>
              <p className="text-xs text-[#B45309] mt-0.5 font-bold">
                A potential duplicate was detected in your active workspace.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B553F] hover:text-[#2A1B0F] clay-btn-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Match Reasons Badges */}
        <div className="p-4 rounded-2xl clay-card bg-[#FFF7ED] border border-[#FED7AA] text-xs text-[#7C2D12] space-y-1.5 font-medium">
          <p className="font-extrabold text-[#9A3412]">Match Indicators Detected:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#7C2D12]">
            {matchReasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>

        {/* Existing Job Card vs New Job Card Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 rounded-2xl clay-card bg-[#FAF3E7] border border-[#F0E4D3] space-y-2">
            <span className="font-extrabold text-[#8B7355] uppercase tracking-wider text-[10px] block">
              New Posting Being Created:
            </span>
            <h4 className="text-sm font-extrabold text-[#2A1B0F] font-['Outfit']">{newJob.title}</h4>
            <p className="text-[#6B553F] text-[11px] font-medium">{newJob.company} • {newJob.minimum_experience} yrs min exp</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {newJob.required_skills.slice(0, 4).map((skill) => (
                <SkillBadge key={skill} skill={skill} type="required" />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl clay-card bg-[#FFF7ED] border border-[#FED7AA] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#9A3412] uppercase tracking-wider text-[10px]">
                Existing Job (#{matchedJob.id})
              </span>
              <span className="text-[#15803D] text-[10px] font-bold">
                {matchedJob.screened_count} screened
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-[#2A1B0F] font-['Outfit']">{matchedJob.title}</h4>
            <p className="text-[#6B553F] text-[11px] font-medium">{matchedJob.company} • {matchedJob.minimum_experience} yrs min exp</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {matchedJob.required_skills.slice(0, 4).map((skill) => (
                <SkillBadge key={skill} skill={skill} type="required" />
              ))}
            </div>
          </div>
        </div>

        {/* Confirmation Question */}
        <p className="text-xs text-[#6B553F] leading-relaxed font-medium">
          Creating duplicate requisitions can fragment candidate rankings. Would you like to view the
          existing job or proceed with creating this new posting anyway?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {onViewExisting && (
            <button
              type="button"
              onClick={() => onViewExisting(matchedJob.id)}
              className="px-4 py-2 text-xs font-bold text-[#4A3520] clay-btn-secondary flex items-center space-x-1.5"
            >
              <span>View Existing Job</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#4A3520] clay-btn-secondary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Create Anyway</span>
          </button>
        </div>
      </div>
    </div>
  );
};
