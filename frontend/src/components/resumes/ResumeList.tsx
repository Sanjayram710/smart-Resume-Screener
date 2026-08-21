import React from 'react';
import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';
import { Resume } from '../../types/candidate';
import { formatDate } from '../../utils/formatters';

interface ResumeListProps {
  resumes: Resume[];
}

export const ResumeList: React.FC<ResumeListProps> = ({ resumes }) => {
  if (resumes.length === 0) {
    return (
      <div className="clay-card rounded-[28px] p-8 text-center text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 clay-icon-blob flex items-center justify-center mx-auto mb-3 text-slate-500">
          <FileText className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-200">No resumes uploaded yet for this job.</p>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF or TXT resumes above to start screening.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCREENED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 clay-badge">
            <CheckCircle2 className="w-3 h-3" />
            <span>Screened</span>
          </span>
        );
      case 'PARSED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 clay-badge">
            <CheckCircle2 className="w-3 h-3" />
            <span>Parsed</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 clay-badge">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 clay-badge">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="clay-card rounded-[28px] overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="text-sm font-extrabold text-white font-['Outfit']">
          Uploaded Resumes ({resumes.length})
        </h4>
      </div>

      <div className="space-y-2">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="p-3.5 rounded-2xl clay-card bg-[#11192a]/60 flex items-center justify-between hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center space-x-3 truncate">
              <div className="p-2 rounded-xl bg-emerald-500/15 clay-icon-blob shrink-0">
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-100 truncate">
                  {resume.filename}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  Uploaded {formatDate(resume.uploaded_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {getStatusBadge(resume.processing_status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
