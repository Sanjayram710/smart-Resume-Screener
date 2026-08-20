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
      <div className="glass-card rounded-xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl font-bold text-emerald-400 font-['Outfit']">
                {candidate.name.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-['Outfit'] tracking-tight">
                {candidate.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                {candidate.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{candidate.email}</span>
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{candidate.phone}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{candidate.years_of_experience.toFixed(1)} Years Verified Experience</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {candidate.summary && (
          <div className="mt-5 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Professional Summary
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{candidate.summary}</p>
          </div>
        )}
      </div>

      {/* Experience Timeline */}
      <div className="glass-card rounded-xl p-6 border border-slate-800">
        <div className="flex items-center space-x-2.5 pb-4 mb-4 border-b border-slate-800">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-slate-100 font-['Outfit']">
            Work Experience Timeline
          </h3>
        </div>

        {candidate.experience && candidate.experience.length > 0 ? (
          <div className="space-y-5">
            {candidate.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-slate-800 space-y-1">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500/20 border-2 border-emerald-400" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <h4 className="font-bold text-slate-100">{exp.title}</h4>
                  <span className="text-slate-400 font-medium">{exp.duration || `${exp.years} yrs`}</span>
                </div>
                {exp.company && <p className="text-xs text-emerald-400 font-medium">{exp.company}</p>}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No work experience entries recorded.</p>
        )}
      </div>

      {/* Education & Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education */}
        <div className="glass-card rounded-xl p-6 border border-slate-800">
          <div className="flex items-center space-x-2.5 pb-4 mb-4 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-slate-100 font-['Outfit']">
              Education
            </h3>
          </div>
          {candidate.education && candidate.education.length > 0 ? (
            <div className="space-y-4">
              {candidate.education.map((edu, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <p className="font-bold text-slate-100">{edu.degree}</p>
                  <p className="text-slate-400">{edu.institution}</p>
                  {edu.graduation_year && (
                    <span className="inline-block text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Graduated {edu.graduation_year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No education entries extracted.</p>
          )}
        </div>

        {/* Projects */}
        <div className="glass-card rounded-xl p-6 border border-slate-800">
          <div className="flex items-center space-x-2.5 pb-4 mb-4 border-b border-slate-800">
            <FolderGit2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-semibold text-slate-100 font-['Outfit']">
              Key Projects
            </h3>
          </div>
          {candidate.projects && candidate.projects.length > 0 ? (
            <div className="space-y-4">
              {candidate.projects.map((proj, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <p className="font-bold text-slate-100">{proj.name}</p>
                  {proj.description && <p className="text-slate-300">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.technologies.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-purple-300 border border-purple-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No featured projects listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};
