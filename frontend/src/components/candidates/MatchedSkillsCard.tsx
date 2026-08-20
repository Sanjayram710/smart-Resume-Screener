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
    <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-slate-100 font-['Outfit']">
            Skill Alignment & Semantic Analysis
          </h3>
        </div>
        <span className="text-xs text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
          {matchedSkills.length} Matched / {missingSkills.length} Missing
        </span>
      </div>

      {/* Exact Matches */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300 mb-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
          <p className="text-xs text-slate-500">No exact matches identified.</p>
        )}
      </div>

      {/* Semantic / Alias Matches */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-cyan-300 mb-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
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
          <p className="text-xs text-slate-500">No semantic alias matches detected.</p>
        )}
      </div>

      {/* Missing Required Skills */}
      {requiredMissing.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300 mb-2.5">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Missing Mandatory Required Skills ({requiredMissing.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredMissing.map((m, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20"
              >
                {m.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Preferred Skills */}
      {preferredMissing.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300 mb-2.5">
            <CircleAlert className="w-4 h-4 text-amber-400" />
            <span>Missing Preferred / Nice-to-Have Skills ({preferredMissing.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferredMissing.map((m, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700"
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
