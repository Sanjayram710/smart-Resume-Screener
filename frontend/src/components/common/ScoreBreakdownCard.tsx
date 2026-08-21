import React from 'react';
import { Award, BookOpen, Brain, Briefcase, Code, Layers } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';

interface ScoreBreakdownCardProps {
  skillScore: number;
  experienceScore: number;
  semanticScore: number;
  educationScore: number;
  certificationScore: number;
  overallScore?: number;
}

export const ScoreBreakdownCard: React.FC<ScoreBreakdownCardProps> = ({
  skillScore,
  experienceScore,
  semanticScore,
  educationScore,
  certificationScore,
}) => {
  const metrics = [
    {
      label: 'Skill Match',
      weight: '40%',
      score: skillScore,
      icon: Code,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      description: 'Exact token & canonical skill alignment',
    },
    {
      label: 'Experience Match',
      weight: '25%',
      score: experienceScore,
      icon: Briefcase,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      description: 'Seniority vs minimum years required',
    },
    {
      label: 'Semantic Relevance',
      weight: '20%',
      score: semanticScore,
      icon: Brain,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      description: 'Vector embedding cosine similarity',
    },
    {
      label: 'Education Match',
      weight: '10%',
      score: educationScore,
      icon: BookOpen,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      description: 'Academic degree hierarchy fulfillment',
    },
    {
      label: 'Certification Match',
      weight: '5%',
      score: certificationScore,
      icon: Award,
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
      description: 'Target licenses and accredited credentials',
    },
  ];

  return (
    <div className="clay-card rounded-[28px] p-6 space-y-4 bg-[#FFFCF7] border border-[#F0E4D3]">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0E4D3]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#FFEDD5] clay-icon-blob">
            <Layers className="w-5 h-5 text-[#EA580C]" />
          </div>
          <h3 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
            Deterministic Scoring Breakdown
          </h3>
        </div>
        <span className="text-xs font-bold text-[#6B553F] clay-badge bg-[#F5EAD9] border-[#EBDCC4] px-3 py-1">
          Scale 1.0 – 10.0
        </span>
      </div>

      <div className="space-y-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="group">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${m.textColor}`} />
                  <span className="font-bold text-[#2A1B0F]">{m.label}</span>
                  <span className="text-[10px] font-bold text-[#7C5A3A] clay-badge bg-[#F5EAD9] border-[#EBDCC4] px-2 py-0.5">
                    Weight: {m.weight}
                  </span>
                </div>
                <span className={`font-bold font-mono text-sm ${m.textColor}`}>
                  {formatPercentage(m.score)}
                </span>
              </div>

              {/* Recessed Clay Progress Bar */}
              <div className="w-full clay-inset bg-[#F5EAD9] border-[#EBDCC4] h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full ${m.color} transition-all duration-700 rounded-full shadow-sm`}
                  style={{ width: `${Math.min(100, Math.max(0, m.score))}%` }}
                />
              </div>
              <p className="text-[11px] text-[#6B553F] mt-1.5 font-medium">{m.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
