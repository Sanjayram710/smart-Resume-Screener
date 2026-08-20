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

interface SkillBadgeProps {
  skill: string;
  type?: 'required' | 'preferred' | 'exact' | 'semantic' | 'missing' | 'default';
  score?: number;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, type = 'default', score }) => {
  const styles = {
    required: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    preferred: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    exact: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    semantic: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    missing: 'bg-rose-500/10 text-rose-300 border-rose-500/30 line-through opacity-80',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${styles[type]} transition-colors`}
    >
      <span>{skill}</span>
      {typeof score === 'number' && (
        <span className="ml-1.5 px-1 py-0.2 rounded bg-slate-900/60 text-[10px] opacity-90 font-mono">
          {Math.round(score * 100)}%
        </span>
      )}
    </span>
  );
};
