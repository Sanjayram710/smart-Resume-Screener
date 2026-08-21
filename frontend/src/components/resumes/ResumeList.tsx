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
      <div className="clay-card rounded-[28px] p-8 text-center text-[#6B553F] bg-[#FFFCF7] border border-[#F0E4D3]">
        <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] clay-icon-blob flex items-center justify-center mx-auto mb-3 text-[#EA580C]">
          <FileText className="w-6 h-6" />
        </div>
        <p className="text-sm font-extrabold text-[#2A1B0F]">No resumes uploaded yet for this job.</p>
        <p className="text-xs text-[#6B553F] mt-1 font-medium">
          Upload PDF or TXT resumes above to start screening.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCREENED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] clay-badge">
            <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
            <span>Screened</span>
          </span>
        );
      case 'PARSED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] clay-badge">
            <CheckCircle2 className="w-3 h-3 text-[#0284C7]" />
            <span>Parsed</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] clay-badge">
            <XCircle className="w-3 h-3 text-[#DC2626]" />
            <span>Failed</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] clay-badge">
            <Clock className="w-3 h-3 text-[#D97706]" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="clay-card rounded-[28px] overflow-hidden p-6 space-y-4 bg-[#FFFCF7] border border-[#F0E4D3]">
      <div className="flex items-center justify-between border-b border-[#F0E4D3] pb-3">
        <h4 className="text-sm font-extrabold text-[#2A1B0F] font-['Outfit']">
          Uploaded Resumes ({resumes.length})
        </h4>
      </div>

      <div className="space-y-2">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="p-3.5 rounded-2xl clay-card bg-[#FAF3E7] border border-[#F0E4D3] flex items-center justify-between hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center space-x-3 truncate">
              <div className="p-2 rounded-xl bg-[#FFEDD5] clay-icon-blob shrink-0">
                <FileText className="w-4 h-4 text-[#EA580C]" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#2A1B0F] truncate">
                  {resume.filename}
                </p>
                <p className="text-[11px] text-[#7C6752] font-medium">
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
