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
        <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs shadow-sm shadow-amber-500/20">
          🥇 1
        </span>
      );
    } else if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/40 flex items-center justify-center font-bold text-xs">
          🥈 2
        </span>
      );
    } else if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-400 border border-amber-700/40 flex items-center justify-center font-bold text-xs">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-semibold text-xs border border-slate-700">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Bar (Molded Clay Container) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 clay-card p-4 rounded-[28px]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full clay-inset text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto p-1 rounded-full clay-inset">
          <span className="text-xs text-slate-400 font-bold px-2 flex items-center space-x-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
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
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'All Candidates' : tab.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rankings Leaderboard Table */}
      <div className="clay-card rounded-[28px] overflow-hidden p-3 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
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
            <tbody className="divide-y divide-white/5 text-xs text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const scoreColors = getScoreColor(item.overall_score);
                  return (
                    <tr
                      key={item.candidate_id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">{getRankBadge(item.rank)}</div>
                      </td>

                      {/* Candidate Name & Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-2xl bg-slate-800/90 border border-white/10 clay-icon-blob flex items-center justify-center text-emerald-300 font-extrabold shrink-0">
                            {item.candidate_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-white group-hover:text-emerald-300 transition-colors font-['Outfit']">
                              {item.candidate_name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {item.candidate_email || item.resume_filename}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Overall Score */}
                      <td className="py-4 px-4 text-center">
                        <div
                          className="inline-flex items-center justify-center px-3.5 py-1 rounded-full font-extrabold font-['Outfit'] text-sm shadow-md clay-badge"
                          style={{
                            backgroundColor: scoreColors.bg.replace('bg-', ''),
                            borderColor: scoreColors.border.replace('border-', ''),
                          }}
                        >
                          <span className={scoreColors.text}>
                            {formatScore(item.overall_score)}
                          </span>
                          <span className="text-[10px] text-slate-300 ml-1">/10</span>
                        </div>
                      </td>

                      {/* Skill Match */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-emerald-300 font-mono">
                          {formatPercentage(item.skill_score)}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {item.matched_skills_count} matched
                        </p>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-slate-200 font-mono">
                          {item.years_of_experience.toFixed(1)} yrs
                        </span>
                        <p className="text-[10px] text-slate-400">
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
                              className="px-2.5 py-0.5 rounded-full bg-[#0f172a] text-slate-300 text-[10px] font-bold clay-inset-pill border border-slate-700/60"
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
