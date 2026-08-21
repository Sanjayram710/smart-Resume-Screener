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
        bgColor: 'bg-[#FEF3C7]',
        textColor: 'text-[#92400E]',
        borderColor: 'border-[#FDE68A]',
        dotColor: 'bg-[#D97706]',
      }
    : norm === 'closed'
    ? {
        label: 'Closed',
        bgColor: 'bg-[#F1E5D4]',
        textColor: 'text-[#6B553F]',
        borderColor: 'border-[#DFCCA8]',
        dotColor: 'bg-[#8C7660]',
      }
    : {
        label: 'Open',
        bgColor: 'bg-[#DCFCE7]',
        textColor: 'text-[#15803D]',
        borderColor: 'border-[#86EFAC]',
        dotColor: 'bg-[#16A34A]',
      };

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-[11px] font-bold' : 'px-3 py-1 text-xs font-bold';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border clay-badge ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClass}`}
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
    required: 'bg-[#F5EAD9] text-[#7C5A3A] border-[#EBDCC4]',
    preferred: 'bg-[#FAF0E1] text-[#9A7049] border-[#EBDCC4]',
    exact: 'bg-[#E6F4EA] text-[#15803D] border-[#86EFAC]',
    semantic: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    missing: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA] line-through opacity-80',
    default: 'bg-[#F5EAD9] text-[#7C5A3A] border-[#EBDCC4]',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border clay-inset-pill ${styles[type]} transition-all`}
    >
      <span>{skill}</span>
      {typeof score === 'number' && (
        <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#EBDCC4]/60 text-[10px] text-[#4A3520] font-mono">
          {Math.round(score * 100)}%
        </span>
      )}
    </span>
  );
};
