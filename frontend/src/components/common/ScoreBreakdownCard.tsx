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
    <div className="glass-card rounded-xl p-6 border border-slate-800">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-slate-100 font-['Outfit']">
            Deterministic Scoring Breakdown
          </h3>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
          Scale 1.0 – 10.0
        </span>
      </div>

      <div className="space-y-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="group">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-3.5 h-3.5 ${m.textColor}`} />
                  <span className="font-medium text-slate-200">{m.label}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                    Weight: {m.weight}
                  </span>
                </div>
                <span className={`font-semibold font-mono ${m.textColor}`}>
                  {formatPercentage(m.score)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${m.color} transition-all duration-700 rounded-full`}
                  style={{ width: `${Math.min(100, Math.max(0, m.score))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{m.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
