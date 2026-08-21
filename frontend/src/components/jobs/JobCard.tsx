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
    <div className="glass-card rounded-xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 group flex flex-col justify-between relative">
      <div>
        {/* Top Meta Bar: Status Badge + Posted Date + Kebab Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2.5">
            <JobStatusBadge status={job.status || 'Open'} size="sm" />
            <span className="flex items-center space-x-1 text-[11px] text-slate-300 font-medium">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatRelativeTime(job.created_at)}</span>
            </span>
          </div>

          {/* Kebab Action Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              title="Job actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-7 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Set Status
                </div>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Open')}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Open'
                      ? 'text-emerald-300 bg-emerald-500/10 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark as Open</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Paused')}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Paused'
                      ? 'text-amber-300 bg-amber-500/10 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mark as Paused</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Closed')}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Closed'
                      ? 'text-slate-300 bg-slate-800 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mark as Closed</span>
                </button>

                {onOpenMethodology && (
                  <>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenMethodology();
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Scoring Methodology</span>
                    </button>
                  </>
                )}

                {onDelete && (
                  <>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-rose-300 hover:bg-rose-500/15 flex items-center space-x-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete Job Requisition</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Title & Company (High Visual Dominance) */}
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors font-['Outfit'] tracking-tight leading-snug">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 mt-1.5">
            <span className="flex items-center space-x-1 text-slate-200 font-medium">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.company}</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center space-x-1 text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.minimum_experience} yrs min exp</span>
            </span>
          </div>
        </div>

        {/* Required Skills Chips */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Required Skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {job.required_skills.slice(0, 5).map((skill) => (
              <SkillBadge key={skill} skill={skill} type="required" />
            ))}
            {job.required_skills.length > 5 && (
              <span className="text-[11px] text-slate-300 font-medium self-center px-1.5 py-0.5 rounded bg-slate-800/90 border border-slate-700">
                +{job.required_skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs">
          <span className="flex items-center space-x-1.5 text-slate-300 font-medium" title="Uploaded resumes">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.resume_count} Resumes</span>
          </span>
          <span
            className="flex items-center space-x-1.5 font-semibold text-emerald-300"
            title="Screened and scored candidates"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{job.screened_count} Screened</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/jobs/${job.id}`}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1"
          >
            <span>View Job</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {/* Rankings Button: Properly Disabled if screened_count === 0 */}
          {hasScreened ? (
            <Link
              to={`/jobs/${job.id}/rankings`}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm shadow-emerald-600/30 transition-all flex items-center space-x-1"
            >
              <span>Rankings</span>
            </Link>
          ) : (
            <div className="relative group/disabled">
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 text-xs font-medium border border-slate-800 cursor-not-allowed transition-colors"
                title="No candidates screened yet"
              >
                <span>Rankings</span>
              </button>
              <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/disabled:block z-20 w-44 p-1.5 rounded-md bg-slate-900 border border-slate-700 text-[11px] text-slate-300 text-center shadow-lg pointer-events-none">
                No candidates screened yet
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-rose-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h4 className="text-base font-bold text-slate-100 font-['Outfit']">
                Delete Job Requisition?
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-100">"{job.title}"</strong>?
              All associated resumes, candidate profiles, and screening scorecards will be permanently removed.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md shadow-rose-600/30"
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
