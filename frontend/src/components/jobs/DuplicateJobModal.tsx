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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-500/10 p-6 space-y-5 overflow-hidden">
        {/* Header with warning styling */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-['Outfit']">
                Similar Job Already Exists
              </h3>
              <p className="text-xs text-amber-300/90 mt-0.5">
                A potential duplicate was detected in your active workspace.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Reasons Badges */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1.5">
          <p className="font-semibold text-amber-300">Match Indicators Detected:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90">
            {matchReasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>

        {/* Existing Job Card vs New Job Card Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block">
              New Posting Being Created:
            </span>
            <h4 className="text-sm font-bold text-slate-100 font-['Outfit']">{newJob.title}</h4>
            <p className="text-slate-300 text-[11px]">{newJob.company} • {newJob.minimum_experience} yrs min exp</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {newJob.required_skills.slice(0, 4).map((skill) => (
                <SkillBadge key={skill} skill={skill} type="required" />
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300 uppercase tracking-wider text-[10px]">
                Existing Job (#{matchedJob.id})
              </span>
              <span className="text-emerald-400 text-[10px] font-medium">
                {matchedJob.screened_count} screened
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 font-['Outfit']">{matchedJob.title}</h4>
            <p className="text-slate-300 text-[11px]">{matchedJob.company} • {matchedJob.minimum_experience} yrs min exp</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {matchedJob.required_skills.slice(0, 4).map((skill) => (
                <SkillBadge key={skill} skill={skill} type="required" />
              ))}
            </div>
          </div>
        </div>

        {/* Confirmation Question */}
        <p className="text-xs text-slate-300 leading-relaxed">
          Creating duplicate requisitions can fragment candidate rankings. Would you like to view the
          existing job or proceed with creating this new posting anyway?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {onViewExisting && (
            <button
              type="button"
              onClick={() => onViewExisting(matchedJob.id)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <span>View Existing Job</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-lg shadow-amber-600/25 transition-all flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Create Anyway</span>
          </button>
        </div>
      </div>
    </div>
  );
};
