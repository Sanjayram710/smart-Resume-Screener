import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Filter, Search } from 'lucide-react';
import { CandidateRankingItem } from '../../types/screening';
import { formatPercentage, formatScore } from '../../utils/formatters';
import { getScoreColor } from '../../utils/scoreColors';
import { RecommendationBadge } from '../common/Badge';

interface RankingTableProps {
  rankings: CandidateRankingItem[];
}

export const RankingTable: React.FC<RankingTableProps> = ({ rankings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRec, setFilterRec] = useState<string>('ALL');

  const filtered = rankings.filter((r) => {
    const matchesSearch =
      r.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.candidate_email && r.candidate_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.top_skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRec = filterRec === 'ALL' || r.recommendation === filterRec;

    return matchesSearch && matchesRec;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] flex items-center justify-center font-bold text-xs clay-badge">
          🥇 1
        </span>
      );
    } else if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-[#F1E5D4] text-[#6B553F] border border-[#DFCCA8] flex items-center justify-center font-bold text-xs clay-badge">
          🥈 2
        </span>
      );
    } else if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-full bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74] flex items-center justify-center font-bold text-xs clay-badge">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-[#F5EAD9] text-[#7C5A3A] flex items-center justify-center font-bold text-xs border border-[#EBDCC4] clay-inset-pill">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Bar (Molded Warm Clay Container) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 clay-card p-4 rounded-[28px] bg-[#FFFCF7] border border-[#F0E4D3]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8B7355] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full clay-inset text-xs text-[#2A1B0F] placeholder:text-[#8B7355] focus:outline-none focus:border-[#FDBA74] font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto p-1 rounded-full clay-inset">
          <span className="text-xs text-[#6B553F] font-bold px-2 flex items-center space-x-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Status:</span>
          </span>
          {['ALL', 'SHORTLIST', 'REVIEW', 'NOT_RECOMMENDED'].map((tab) => {
            const isSelected = filterRec === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilterRec(tab)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'clay-btn-primary text-white shadow-md'
                    : 'text-[#6B553F] hover:text-[#2A1B0F]'
                }`}
              >
                {tab === 'ALL' ? 'All Candidates' : tab.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rankings Leaderboard Table */}
      <div className="clay-card rounded-[28px] overflow-hidden p-3 shadow-xl bg-[#FFFCF7] border border-[#F0E4D3]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F0E4D3] text-[11px] font-extrabold text-[#6B553F] uppercase tracking-wider">
                <th className="py-4 px-4 text-center w-16">Rank</th>
                <th className="py-4 px-4">Candidate</th>
                <th className="py-4 px-4 text-center">Score (1-10)</th>
                <th className="py-4 px-4 text-center">Skill Match</th>
                <th className="py-4 px-4 text-center">Experience</th>
                <th className="py-4 px-4">Recommendation</th>
                <th className="py-4 px-4">Top Skills</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E4D3] text-xs text-[#2A1B0F]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#6B553F] font-medium">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const scoreColors = getScoreColor(item.overall_score);
                  return (
                    <tr
                      key={item.candidate_id}
                      className="hover:bg-[#FAF3E7]/70 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">{getRankBadge(item.rank)}</div>
                      </td>

                      {/* Candidate Name & Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-2xl bg-[#FFEDD5] border border-[#FDBA74] clay-icon-blob flex items-center justify-center text-[#EA580C] font-extrabold shrink-0">
                            {item.candidate_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-[#2A1B0F] group-hover:text-[#EA580C] transition-colors font-['Outfit']">
                              {item.candidate_name}
                            </p>
                            <p className="text-[11px] text-[#7C6752] font-medium">
                              {item.candidate_email || item.resume_filename}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Overall Score */}
                      <td className="py-4 px-4 text-center">
                        <div
                          className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full font-extrabold font-['Outfit'] text-sm shadow-sm clay-badge ${scoreColors.bg} ${scoreColors.border}`}
                        >
                          <span className={scoreColors.text}>
                            {formatScore(item.overall_score)}
                          </span>
                          <span className="text-[10px] text-[#7C6752] ml-1">/10</span>
                        </div>
                      </td>

                      {/* Skill Match */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-[#15803D] font-mono">
                          {formatPercentage(item.skill_score)}
                        </span>
                        <p className="text-[10px] text-[#7C6752] font-medium">
                          {item.matched_skills_count} matched
                        </p>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-[#2A1B0F] font-mono">
                          {item.years_of_experience.toFixed(1)} yrs
                        </span>
                        <p className="text-[10px] text-[#7C6752] font-medium">
                          {formatPercentage(item.experience_score)} exp score
                        </p>
                      </td>

                      {/* Recommendation */}
                      <td className="py-4 px-4">
                        <RecommendationBadge recommendation={item.recommendation} size="sm" />
                      </td>

                      {/* Top Skills */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {item.top_skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-0.5 rounded-full bg-[#F5EAD9] text-[#7C5A3A] text-[10px] font-bold clay-inset-pill border border-[#EBDCC4]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/candidates/${item.candidate_id}`}
                          className="inline-flex items-center space-x-1 px-4 py-1.5 text-xs font-extrabold text-white clay-btn-primary"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
