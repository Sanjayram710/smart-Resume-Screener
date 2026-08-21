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
    <div className="clay-card rounded-[28px] p-7 space-y-6 bg-[#FFFCF7] border border-[#F0E4D3]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E4D3]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#FFEDD5] clay-icon-blob">
            <Bot className="w-5 h-5 text-[#EA580C]" />
          </div>
          <h3 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
            AI Recruiter Intelligence & Assessment
          </h3>
        </div>
        <RecommendationBadge recommendation={recommendation} size="md" />
      </div>

      {/* Rationale & Explanation */}
      <div className="p-5 rounded-[24px] clay-card bg-[#FAF3E7] border border-[#F0E4D3] space-y-2">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-[#C2410C]">
          <Sparkles className="w-4 h-4 text-[#EA580C]" />
          <span>Evidence-Based Justification</span>
        </div>
        <p className="text-xs text-[#2A1B0F] leading-relaxed font-sans font-medium">{explanation}</p>
      </div>

      {/* Strengths & Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#15803D]">
            <ThumbsUp className="w-4 h-4 text-[#16A34A]" />
            <span>Key Strengths & Highlights</span>
          </div>
          {strengths && strengths.length > 0 ? (
            <div className="space-y-2.5">
              {strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl clay-card bg-[#DCFCE7] border border-[#86EFAC] text-xs text-[#15803D] flex items-start space-x-2.5 font-medium"
                >
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8B7355]">No specific strengths cataloged.</p>
          )}
        </div>

        {/* Gaps / Risks */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#B91C1C]">
            <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
            <span>Gaps & Screener Caveats</span>
          </div>
          {gaps && gaps.length > 0 ? (
            <div className="space-y-2.5">
              {gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl clay-card bg-[#FEE2E2] border border-[#FECACA] text-xs text-[#991B1B] flex items-start space-x-2.5 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0 mt-1.5" />
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8B7355]">No significant skill gaps flagged.</p>
          )}
        </div>
      </div>
    </div>
  );
};
