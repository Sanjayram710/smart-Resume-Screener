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
      <div className="glass-card rounded-xl p-8 text-center border border-slate-800 text-slate-400">
        <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium">No resumes uploaded yet for this job.</p>
        <p className="text-xs text-slate-500 mt-1">
          Upload PDF or TXT resumes above to start screening.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCREENED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Screened</span>
          </span>
        );
      case 'PARSED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Parsed</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-200">
          Uploaded Resumes ({resumes.length})
        </h4>
      </div>

      <div className="divide-y divide-slate-800/80">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center space-x-3 truncate">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {resume.filename}
                </p>
                <p className="text-[11px] text-slate-500">
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
