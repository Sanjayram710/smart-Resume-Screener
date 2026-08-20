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
    <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <Bot className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-slate-100 font-['Outfit']">
            AI Recruiter Intelligence & Assessment
          </h3>
        </div>
        <RecommendationBadge recommendation={recommendation} size="md" />
      </div>

      {/* Rationale & Explanation */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>Evidence-Based Justification</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{explanation}</p>
      </div>

      {/* Strengths & Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300">
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
            <span>Key Strengths & Highlights</span>
          </div>
          {strengths && strengths.length > 0 ? (
            <div className="space-y-2">
              {strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-start space-x-2.5"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No specific strengths cataloged.</p>
          )}
        </div>

        {/* Gaps / Risks */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Gaps & Screener Caveats</span>
          </div>
          {gaps && gaps.length > 0 ? (
            <div className="space-y-2">
              {gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start space-x-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No significant skill gaps flagged.</p>
          )}
        </div>
      </div>
    </div>
  );
};
