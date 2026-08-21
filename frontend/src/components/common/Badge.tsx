import React from 'react';
import { getRecommendationBadge } from '../../utils/scoreColors';

interface RecommendationBadgeProps {
  recommendation: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RecommendationBadge: React.FC<RecommendationBadgeProps> = ({
  recommendation,
  size = 'md',
}) => {
  const badge = getRecommendationBadge(recommendation);

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-bold',
    lg: 'px-4 py-1.5 text-sm font-extrabold',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border clay-badge ${badge.bgColor} ${badge.textColor} ${badge.borderColor} ${sizeClasses[size]}`}
    >
      <span className={`w-2 h-2 rounded-full ${badge.dotColor} shadow-[0_0_8px_currentColor]`} />
      <span>{badge.label}</span>
    </span>
  );
};

interface JobStatusBadgeProps {
  status?: string;
  size?: 'sm' | 'md';
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status = 'Open', size = 'sm' }) => {
  const norm = status?.toLowerCase() || 'open';
  
  const config = norm === 'paused'
    ? {
        label: 'Paused',
        bgColor: 'bg-gradient-to-r from-amber-500/20 to-amber-600/10',
        textColor: 'text-amber-200',
        borderColor: 'border-amber-500/40',
        dotColor: 'bg-amber-400',
      }
    : norm === 'closed'
    ? {
        label: 'Closed',
        bgColor: 'bg-gradient-to-r from-slate-800 to-slate-850',
        textColor: 'text-slate-300',
        borderColor: 'border-slate-700',
        dotColor: 'bg-slate-400',
      }
    : {
        label: 'Open',
        bgColor: 'bg-gradient-to-r from-emerald-500/20 to-teal-600/10',
        textColor: 'text-emerald-200',
        borderColor: 'border-emerald-500/40',
        dotColor: 'bg-emerald-400',
      };

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-[11px] font-bold' : 'px-3 py-1 text-xs font-bold';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border clay-badge ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shadow-[0_0_6px_currentColor]`} />
      <span>{config.label}</span>
    </span>
  );
};

interface SkillBadgeProps {
  skill: string;
  type?: 'required' | 'preferred' | 'exact' | 'semantic' | 'missing' | 'default';
  score?: number;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, type = 'default', score }) => {
  const styles = {
    required: 'bg-[#0f172a] text-indigo-200 border-indigo-500/30',
    preferred: 'bg-[#0f172a] text-sky-200 border-sky-500/30',
    exact: 'bg-[#0b1b1f] text-emerald-200 border-emerald-500/40',
    semantic: 'bg-[#091e28] text-cyan-200 border-cyan-500/40',
    missing: 'bg-[#1e1015] text-rose-300 border-rose-500/40 line-through opacity-85',
    default: 'bg-[#0f172a] text-slate-200 border-slate-700/60',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border clay-inset-pill ${styles[type]} transition-all`}
    >
      <span>{skill}</span>
      {typeof score === 'number' && (
        <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] text-slate-200 font-mono">
          {Math.round(score * 100)}%
        </span>
      )}
    </span>
  );
};
