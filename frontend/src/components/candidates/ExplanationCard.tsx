import React from 'react';
import { Bot, Check, ShieldAlert, Sparkles, ThumbsUp } from 'lucide-react';
import { RecommendationBadge } from '../common/Badge';

interface ExplanationCardProps {
  recommendation: string;
  explanation: string;
  strengths: string[];
  gaps: string[];
  llmAssessment?: Record<string, any>;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  recommendation,
  explanation,
  strengths,
  gaps,
}) => {
  return (
    <div className="clay-card rounded-[28px] p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 clay-icon-blob">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-base font-extrabold text-white font-['Outfit']">
            AI Recruiter Intelligence & Assessment
          </h3>
        </div>
        <RecommendationBadge recommendation={recommendation} size="md" />
      </div>

      {/* Rationale & Explanation */}
      <div className="p-5 rounded-[24px] clay-card space-y-2">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Evidence-Based Justification</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{explanation}</p>
      </div>

      {/* Strengths & Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
            <span>Key Strengths & Highlights</span>
          </div>
          {strengths && strengths.length > 0 ? (
            <div className="space-y-2.5">
              {strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl clay-card bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 flex items-start space-x-2.5"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No specific strengths cataloged.</p>
          )}
        </div>

        {/* Gaps / Risks */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Gaps & Screener Caveats</span>
          </div>
          {gaps && gaps.length > 0 ? (
            <div className="space-y-2.5">
              {gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl clay-card bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 flex items-start space-x-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-1.5 shadow-[0_0_6px_currentColor]" />
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No significant skill gaps flagged.</p>
          )}
        </div>
      </div>
    </div>
  );
};
