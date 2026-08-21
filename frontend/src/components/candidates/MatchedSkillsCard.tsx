import React from 'react';
import { CheckCircle2, CircleAlert, Sparkles, XCircle } from 'lucide-react';
import { SkillBadge } from '../common/Badge';

interface MatchedSkillsCardProps {
  matchedSkills: Array<{
    id?: number;
    skill: string;
    match_type: 'EXACT' | 'SEMANTIC' | 'PARTIAL';
    similarity_score: number;
  }>;
  missingSkills: Array<{
    id?: number;
    skill: string;
    importance: 'REQUIRED' | 'PREFERRED';
  }>;
}

export const MatchedSkillsCard: React.FC<MatchedSkillsCardProps> = ({
  matchedSkills,
  missingSkills,
}) => {
  const exactMatches = matchedSkills.filter((m) => m.match_type === 'EXACT');
  const semanticMatches = matchedSkills.filter(
    (m) => m.match_type === 'SEMANTIC' || m.match_type === 'PARTIAL'
  );
  const requiredMissing = missingSkills.filter((m) => m.importance === 'REQUIRED');
  const preferredMissing = missingSkills.filter((m) => m.importance === 'PREFERRED');

  return (
    <div className="clay-card rounded-[28px] p-7 space-y-6 bg-[#FFFCF7] border border-[#F0E4D3]">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0E4D3]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#FFEDD5] clay-icon-blob">
            <Sparkles className="w-5 h-5 text-[#EA580C]" />
          </div>
          <h3 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
            Skill Alignment & Semantic Analysis
          </h3>
        </div>
        <span className="text-xs text-[#C2410C] font-mono font-extrabold clay-badge bg-[#FFEDD5] border border-[#FDBA74] px-3 py-1">
          {matchedSkills.length} Matched / {missingSkills.length} Missing
        </span>
      </div>

      {/* Exact Matches */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#15803D] mb-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          <span>Exact Verified Matches ({exactMatches.length})</span>
        </div>
        {exactMatches.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {exactMatches.map((m, idx) => (
              <SkillBadge
                key={idx}
                skill={m.skill}
                type="exact"
                score={m.similarity_score}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8B7355]">No exact matches identified.</p>
        )}
      </div>

      {/* Semantic / Alias Matches */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0369A1] mb-2.5">
          <Sparkles className="w-4 h-4 text-[#0284C7]" />
          <span>Semantic & Adjacent Competencies ({semanticMatches.length})</span>
        </div>
        {semanticMatches.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {semanticMatches.map((m, idx) => (
              <SkillBadge
                key={idx}
                skill={m.skill}
                type="semantic"
                score={m.similarity_score}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8B7355]">No semantic alias matches detected.</p>
        )}
      </div>

      {/* Missing Required Skills */}
      {requiredMissing.length > 0 && (
        <div className="pt-3 border-t border-[#F0E4D3]">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#B91C1C] mb-2.5">
            <XCircle className="w-4 h-4 text-[#DC2626]" />
            <span>Missing Mandatory Required Skills ({requiredMissing.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredMissing.map((m, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] clay-inset-pill"
              >
                {m.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Preferred Skills */}
      {preferredMissing.length > 0 && (
        <div className="pt-2 border-t border-[#F0E4D3]">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#B45309] mb-2.5">
            <CircleAlert className="w-4 h-4 text-[#D97706]" />
            <span>Missing Preferred / Nice-to-Have Skills ({preferredMissing.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferredMissing.map((m, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#F5EAD9] text-[#7C5A3A] border border-[#EBDCC4] clay-inset-pill"
              >
                {m.skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
