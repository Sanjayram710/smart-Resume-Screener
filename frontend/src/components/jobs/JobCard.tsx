import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ChevronRight, Clock, FileText, Sparkles } from 'lucide-react';
import { JobSummary } from '../../types/job';
import { SkillBadge } from '../common/Badge';

interface JobCardProps {
  job: JobSummary;
  onDelete?: (id: number) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 hover:border-emerald-500/30 transition-all duration-200 group flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors font-['Outfit']">
              {job.title}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{job.company}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{job.minimum_experience} yrs min exp</span>
              </span>
            </div>
          </div>
        </div>

        {/* Required Skills Chips */}
        <div className="mt-4">
          <p className="text-[11px] font-medium text-slate-400 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {job.required_skills.slice(0, 5).map((skill) => (
              <SkillBadge key={skill} skill={skill} type="required" />
            ))}
            {job.required_skills.length > 5 && (
              <span className="text-[10px] text-slate-500 self-center px-1">
                +{job.required_skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{job.resume_count} Resumes</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium">{job.screened_count} Screened</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/jobs/${job.id}`}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center space-x-1"
          >
            <span>View Job</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/jobs/${job.id}/rankings`}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all flex items-center space-x-1"
          >
            <span>Rankings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
