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
    <div className="clay-card-interactive p-4 sm:p-5 rounded-[28px] flex flex-col justify-between relative group h-full">
      <div>
        {/* Top Meta Bar: Status Badge + Posted Date + Kebab Menu */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <JobStatusBadge status={job.status || 'Open'} size="sm" />
            <span className="flex items-center space-x-1 text-[11px] text-[#6B553F] font-bold">
              <Calendar className="w-3.5 h-3.5 text-[#8B7355]" />
              <span>{formatRelativeTime(job.created_at)}</span>
            </span>
          </div>

          {/* Kebab Action Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-full text-[#6B553F] hover:text-[#2A1B0F] clay-btn-secondary transition-colors"
              title="Job actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-9 w-48 rounded-2xl bg-[#FFFCF7] border border-[#F0E4D3] shadow-[0_12px_32px_rgba(180,110,40,0.14)] py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[10px] font-extrabold text-[#8B7355] uppercase tracking-wider border-b border-[#F0E4D3]">
                  Set Status
                </div>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Open')}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Open'
                      ? 'text-[#15803D] bg-[#DCFCE7] font-bold'
                      : 'text-[#4A3520] hover:bg-[#F5EAD9]'
                  }`}
                >
                  <PlayCircle className="w-4 h-4 text-[#16A34A]" />
                  <span>Mark as Open</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Paused')}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Paused'
                      ? 'text-[#92400E] bg-[#FEF3C7] font-bold'
                      : 'text-[#4A3520] hover:bg-[#F5EAD9]'
                  }`}
                >
                  <PauseCircle className="w-4 h-4 text-[#D97706]" />
                  <span>Mark as Paused</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusSelect('Closed')}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center space-x-2 transition-colors ${
                    job.status === 'Closed'
                      ? 'text-[#6B553F] bg-[#F1E5D4] font-bold'
                      : 'text-[#4A3520] hover:bg-[#F5EAD9]'
                  }`}
                >
                  <Archive className="w-4 h-4 text-[#8C7660]" />
                  <span>Mark as Closed</span>
                </button>

                {onOpenMethodology && (
                  <>
                    <div className="my-1.5 border-t border-[#F0E4D3]" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenMethodology();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-[#4A3520] hover:bg-[#F5EAD9] flex items-center space-x-2"
                    >
                      <HelpCircle className="w-4 h-4 text-[#EA580C]" />
                      <span>Scoring Methodology</span>
                    </button>
                  </>
                )}

                {onDelete && (
                  <>
                    <div className="my-1.5 border-t border-[#F0E4D3]" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-[#991B1B] hover:bg-[#FEE2E2] flex items-center space-x-2 font-bold"
                    >
                      <Trash2 className="w-4 h-4 text-[#DC2626]" />
                      <span>Delete Requisition</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Title & Company (Molded Warm Visual Dominance) */}
        <div>
          <h3 className="text-xl font-extrabold text-[#2A1B0F] group-hover:text-[#EA580C] transition-colors font-['Outfit'] tracking-tight leading-snug">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#6B553F] mt-2">
            <span className="flex items-center space-x-1.5 text-[#4A3520] font-bold">
              <Building className="w-4 h-4 text-[#8B7355]" />
              <span>{job.company}</span>
            </span>
            <span className="text-[#C5B49F]">•</span>
            <span className="flex items-center space-x-1.5 text-[#6B553F] font-semibold">
              <Clock className="w-4 h-4 text-[#8B7355]" />
              <span>{job.minimum_experience} yrs min exp</span>
            </span>
          </div>
        </div>

        {/* Required Skills Recessed Chips */}
        <div className="mt-4">
          <p className="text-[11px] font-bold text-[#6B553F] uppercase tracking-wider mb-2">
            Required Skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {job.required_skills.slice(0, 5).map((skill) => (
              <SkillBadge key={skill} skill={skill} type="required" />
            ))}
            {job.required_skills.length > 5 && (
              <span className="text-[11px] text-[#7C5A3A] font-bold self-center px-2 py-0.5 rounded-full clay-inset-pill bg-[#F5EAD9] border border-[#EBDCC4]">
                +{job.required_skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats & Actions */}
      <div className="mt-5 pt-3.5 border-t border-[#F0E4D3] flex items-center justify-between gap-2 w-full">
        {/* Stats: Resumes & Screened */}
        <div className="flex items-center gap-2 text-[11px] leading-none shrink-0">
          <span
            className="inline-flex items-center gap-1 text-[#6B553F] font-bold whitespace-nowrap leading-none"
            title="Uploaded resumes"
          >
            <FileText className="w-3.5 h-3.5 text-[#8B7355] shrink-0" />
            <span className="leading-none">{job.resume_count} Resumes</span>
          </span>

          <span
            className="inline-flex items-center gap-1 font-bold text-[#C2410C] whitespace-nowrap leading-none"
            title="Screened and scored candidates"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
            <span className="leading-none">{job.screened_count} Screened</span>
          </span>
        </div>

        {/* Action Buttons: View Job & Rankings */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to={`/jobs/${job.id}`}
            className="h-8 px-2.5 text-xs font-bold text-[#4A3520] hover:text-[#2A1B0F] clay-btn-secondary inline-flex items-center justify-center gap-1 whitespace-nowrap leading-none shrink-0"
          >
            <span className="leading-none">View Job</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </Link>

          {/* Rankings Button: Clay Styled */}
          {hasScreened ? (
            <Link
              to={`/jobs/${job.id}/rankings`}
              className="h-8 px-2.5 text-xs font-extrabold text-white clay-btn-primary inline-flex items-center justify-center whitespace-nowrap leading-none shrink-0"
            >
              <span className="leading-none">Rankings</span>
            </Link>
          ) : (
            <div className="relative group/disabled inline-flex items-center shrink-0">
              <button
                type="button"
                disabled
                className="h-8 px-2.5 rounded-full bg-[#F1E5D4] text-[#8C7660] text-xs font-bold border border-[#DFCCA8] cursor-not-allowed transition-colors inline-flex items-center justify-center whitespace-nowrap leading-none"
                title="No candidates screened yet"
              >
                <span className="leading-none">Rankings</span>
              </button>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover/disabled:block z-20 w-44 p-2 rounded-2xl bg-[#2A1B0F] text-white text-[11px] text-center shadow-xl pointer-events-none">
                No candidates screened yet
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm clay-card p-6 space-y-4 shadow-[0_20px_50px_rgba(180,110,40,0.25)] border border-[#FCA5A5] bg-[#FFFCF7]">
            <div className="flex items-center space-x-3 text-[#DC2626]">
              <div className="p-2.5 rounded-2xl bg-[#FEE2E2] clay-icon-blob">
                <Trash2 className="w-5 h-5 text-[#DC2626]" />
              </div>
              <h4 className="text-lg font-extrabold text-[#2A1B0F] font-['Outfit']">
                Delete Requisition?
              </h4>
            </div>
            <p className="text-xs text-[#6B553F] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#2A1B0F]">"{job.title}"</strong>?
              All associated resumes, candidate profiles, and screening scorecards will be permanently removed.
            </p>
            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-[#4A3520] clay-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-600 to-red-700 text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all"
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
