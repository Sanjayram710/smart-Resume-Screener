import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  Building,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { JobStatus, JobSummary } from '../../types/job';
import { JobStatusBadge, SkillBadge } from '../common/Badge';
import { formatRelativeTime } from '../../utils/formatters';

interface JobCardProps {
  job: JobSummary;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: JobStatus) => void;
  onOpenMethodology?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onDelete,
  onStatusChange,
  onOpenMethodology,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasScreened = (job.screened_count || 0) > 0;

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDelete = () => {
    setIsMenuOpen(false);
    setShowDeleteConfirm(false);
    if (onDelete) {
      onDelete(job.id);
    }
  };

  const handleStatusSelect = (newStatus: JobStatus) => {
    setIsMenuOpen(false);
    if (onStatusChange) {
      onStatusChange(job.id, newStatus);
    }
  };

  return (
    <div className="clay-card-interactive p-6 sm:p-7 rounded-[28px] flex flex-col justify-between relative group">
      <div>
        {/* Top Meta Bar: Status Badge + Posted Date + Kebab Menu */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2.5">
            <JobStatusBadge status={job.status || 'Open'} size="sm" />
            <span className="flex items-center space-x-1 text-[11px] text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatRelativeTime(job.created_at)}</span>
            </span>
          </div>

          {/* Kebab Action Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white clay-btn-secondary transition-colors"
              title="Job actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-9 w-48 rounded-2xl bg-slate-900 border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.6)] py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-white/5">
                  Set Status
                </div>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Open')}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Open'
                      ? 'text-emerald-300 bg-emerald-500/10 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <PlayCircle className="w-4 h-4 text-emerald-400" />
                  <span>Mark as Open</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Paused')}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Paused'
                      ? 'text-amber-300 bg-amber-500/10 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <PauseCircle className="w-4 h-4 text-amber-400" />
                  <span>Mark as Paused</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Closed')}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Closed'
                      ? 'text-slate-200 bg-slate-800 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Archive className="w-4 h-4 text-slate-400" />
                  <span>Mark as Closed</span>
                </button>

                {onOpenMethodology && (
                  <>
                    <div className="my-1.5 border-t border-white/5" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenMethodology();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:bg-slate-800/60 flex items-center space-x-2"
                    >
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span>Scoring Methodology</span>
                    </button>
                  </>
                )}

                {onDelete && (
                  <>
                    <div className="my-1.5 border-t border-white/5" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-rose-300 hover:bg-rose-500/20 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span>Delete Requisition</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Title & Company (Molded Clay Visual Dominance) */}
        <div>
          <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors font-['Outfit'] tracking-tight leading-snug">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
            <span className="flex items-center space-x-1.5 text-slate-200 font-semibold">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{job.company}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center space-x-1.5 text-slate-300 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{job.minimum_experience} yrs min exp</span>
            </span>
          </div>
        </div>

        {/* Required Skills Recessed Chips */}
        <div className="mt-5">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Required Skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {job.required_skills.slice(0, 5).map((skill) => (
              <SkillBadge key={skill} skill={skill} type="required" />
            ))}
            {job.required_skills.length > 5 && (
              <span className="text-[11px] text-slate-300 font-bold self-center px-2.5 py-0.5 rounded-full clay-inset-pill bg-[#0f172a] border border-slate-700/60">
                +{job.required_skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats & Actions */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs">
          <span className="flex items-center space-x-1.5 text-slate-300 font-medium" title="Uploaded resumes">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{job.resume_count} Resumes</span>
          </span>
          <span
            className="flex items-center space-x-1.5 font-bold text-emerald-300"
            title="Screened and scored candidates"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{job.screened_count} Screened</span>
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to={`/jobs/${job.id}`}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-200 clay-btn-secondary flex items-center space-x-1"
          >
            <span>View Job</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {/* Rankings Button: Clay Styled */}
          {hasScreened ? (
            <Link
              to={`/jobs/${job.id}/rankings`}
              className="px-4 py-1.5 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-1"
            >
              <span>Rankings</span>
            </Link>
          ) : (
            <div className="relative group/disabled">
              <button
                type="button"
                disabled
                className="px-3.5 py-1.5 rounded-full bg-[#0a0f1d] text-slate-500 text-xs font-medium border border-white/5 cursor-not-allowed transition-colors"
                title="No candidates screened yet"
              >
                <span>Rankings</span>
              </button>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover/disabled:block z-20 w-48 p-2 rounded-2xl bg-slate-900 border border-white/10 text-[11px] text-slate-200 text-center shadow-2xl pointer-events-none">
                No candidates screened yet
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm clay-card p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-rose-500/40">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 clay-icon-blob">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-extrabold text-white font-['Outfit']">
                Delete Requisition?
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{job.title}"</strong>?
              All associated resumes, candidate profiles, and screening scorecards will be permanently removed.
            </p>
            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-300 clay-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-600 to-red-700 text-xs font-bold text-white shadow-[4px_4px_12px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
