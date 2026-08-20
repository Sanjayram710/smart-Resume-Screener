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
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-card p-3.5 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidates or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center space-x-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {['ALL', 'SHORTLIST', 'REVIEW', 'NOT_RECOMMENDED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterRec(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                filterRec === tab
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab === 'ALL' ? 'All Candidates' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Leaderboard Table */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-14">Rank</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4 text-center">Score (1-10)</th>
                <th className="py-3.5 px-4 text-center">Skill Match</th>
                <th className="py-3.5 px-4 text-center">Experience</th>
                <th className="py-3.5 px-4">Recommendation</th>
                <th className="py-3.5 px-4">Top Skills</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const scoreColors = getScoreColor(item.overall_score);
                  return (
                    <tr
                      key={item.candidate_id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">{getRankBadge(item.rank)}</div>
                      </td>

                      {/* Candidate Name & Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold shrink-0">
                            {item.candidate_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors font-['Outfit']">
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
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg border font-bold font-['Outfit'] text-sm shadow-sm"
                          style={{
                            backgroundColor: scoreColors.bg.replace('bg-', ''),
                            borderColor: scoreColors.border.replace('border-', ''),
                          }}
                        >
                          <span className={scoreColors.text}>
                            {formatScore(item.overall_score)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">/10</span>
                        </div>
                      </td>

                      {/* Skill Match */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-emerald-400 font-mono">
                          {formatPercentage(item.skill_score)}
                        </span>
                        <p className="text-[10px] text-slate-500">
                          {item.matched_skills_count} matched
                        </p>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-slate-200 font-mono">
                          {item.years_of_experience.toFixed(1)} yrs
                        </span>
                        <p className="text-[10px] text-slate-500">
                          {formatPercentage(item.experience_score)} exp score
                        </p>
                      </td>

                      {/* Recommendation */}
                      <td className="py-4 px-4">
                        <RecommendationBadge recommendation={item.recommendation} size="sm" />
                      </td>

                      {/* Top Skills */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {item.top_skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700"
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
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all"
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
