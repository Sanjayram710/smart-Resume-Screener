import React from 'react';
import { BookOpen, Briefcase, FolderGit2, Mail, Phone } from 'lucide-react';
import { CandidateDetail } from '../../types/candidate';

interface CandidateProfileCardProps {
  candidate: CandidateDetail;
}

export const CandidateProfileCard: React.FC<CandidateProfileCardProps> = ({ candidate }) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="clay-card rounded-[28px] p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 clay-icon-blob">
              <div className="w-full h-full bg-[#111827] rounded-[20px] flex items-center justify-center text-2xl font-extrabold text-emerald-400 font-['Outfit']">
                {candidate.name.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit'] tracking-tight">
                {candidate.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                {candidate.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate.email}</span>
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate.phone}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-emerald-300 font-bold">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{candidate.years_of_experience.toFixed(1)} Years Verified Experience</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {candidate.summary && (
          <div className="mt-5 pt-4 border-t border-white/5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Professional Summary
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">{candidate.summary}</p>
          </div>
        )}
      </div>

      {/* Experience Timeline */}
      <div className="clay-card rounded-[28px] p-7">
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-white/5">
          <div className="p-2 rounded-xl bg-emerald-500/20 clay-icon-blob">
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-base font-extrabold text-white font-['Outfit']">
            Work Experience Timeline
          </h3>
        </div>

        {candidate.experience && candidate.experience.length > 0 ? (
          <div className="space-y-6">
            {candidate.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-emerald-500/30 space-y-1.5">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_currentColor]" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <h4 className="font-extrabold text-white">{exp.title}</h4>
                  <span className="text-slate-400 font-medium">{exp.duration || `${exp.years} yrs`}</span>
                </div>
                {exp.company && <p className="text-xs text-emerald-300 font-bold">{exp.company}</p>}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-slate-200 list-disc list-inside">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full bg-[#0f172a] text-[10px] text-slate-300 font-bold clay-inset-pill border border-slate-700/60">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No work experience entries recorded.</p>
        )}
      </div>

      {/* Education & Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education */}
        <div className="clay-card rounded-[28px] p-6 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
            <div className="p-2 rounded-xl bg-amber-500/20 clay-icon-blob">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-extrabold text-white font-['Outfit']">
              Education
            </h3>
          </div>
          {candidate.education && candidate.education.length > 0 ? (
            <div className="space-y-4">
              {candidate.education.map((edu, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <p className="font-extrabold text-white">{edu.degree}</p>
                  <p className="text-slate-300">{edu.institution}</p>
                  {edu.graduation_year && (
                    <span className="inline-block text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full clay-badge border border-amber-500/30">
                      Graduated {edu.graduation_year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No education entries extracted.</p>
          )}
        </div>

        {/* Projects */}
        <div className="clay-card rounded-[28px] p-6 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
            <div className="p-2 rounded-xl bg-purple-500/20 clay-icon-blob">
              <FolderGit2 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-base font-extrabold text-white font-['Outfit']">
              Key Projects
            </h3>
          </div>
          {candidate.projects && candidate.projects.length > 0 ? (
            <div className="space-y-4">
              {candidate.projects.map((proj, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <p className="font-extrabold text-white">{proj.name}</p>
                  {proj.description && <p className="text-slate-300">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.technologies.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-[#0f172a] text-[10px] font-bold text-purple-300 clay-inset-pill border border-purple-500/30">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No featured projects listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};
