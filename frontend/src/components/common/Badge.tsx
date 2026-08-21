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
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border ${badge.bgColor} ${badge.textColor} ${badge.borderColor} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
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
        bgColor: 'bg-amber-500/15',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-500/40',
        dotColor: 'bg-amber-400',
      }
    : norm === 'closed'
    ? {
        label: 'Closed',
        bgColor: 'bg-slate-800/80',
        textColor: 'text-slate-300',
        borderColor: 'border-slate-700',
        dotColor: 'bg-slate-400',
      }
    : {
        label: 'Open',
        bgColor: 'bg-emerald-500/15',
        textColor: 'text-emerald-300',
        borderColor: 'border-emerald-500/40',
        dotColor: 'bg-emerald-400',
      };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px] font-medium' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
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
    required: 'bg-indigo-950/70 text-indigo-200 border-indigo-500/40 font-medium',
    preferred: 'bg-sky-950/70 text-sky-200 border-sky-500/40 font-medium',
    exact: 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40 font-medium',
    semantic: 'bg-cyan-950/70 text-cyan-200 border-cyan-500/40 font-medium',
    missing: 'bg-rose-950/70 text-rose-300 border-rose-500/40 line-through opacity-85',
    default: 'bg-slate-800 text-slate-200 border-slate-700 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs border ${styles[type]} transition-colors`}
    >
      <span>{skill}</span>
      {typeof score === 'number' && (
        <span className="ml-1.5 px-1 py-0.2 rounded bg-slate-900/80 text-[10px] text-slate-200 font-mono">
          {Math.round(score * 100)}%
        </span>
      )}
    </span>
  );
};
