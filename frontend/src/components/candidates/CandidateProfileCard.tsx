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
      <div className="clay-card rounded-[28px] p-7 bg-[#FFFCF7] border border-[#F0E4D3]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-[#FB923C] to-[#EA580C] p-0.5 clay-icon-blob">
              <div className="w-full h-full bg-[#FFFCF7] rounded-[20px] flex items-center justify-center text-2xl font-extrabold text-[#EA580C] font-['Outfit']">
                {candidate.name.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight">
                {candidate.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B553F] mt-1 font-medium">
                {candidate.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-[#8B7355]" />
                    <span>{candidate.email}</span>
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-[#8B7355]" />
                    <span>{candidate.phone}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-[#C2410C] font-extrabold">
                  <Briefcase className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>{candidate.years_of_experience.toFixed(1)} Years Verified Experience</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {candidate.summary && (
          <div className="mt-5 pt-4 border-t border-[#F0E4D3]">
            <h4 className="text-xs font-extrabold text-[#2A1B0F] uppercase tracking-wider mb-1.5">
              Professional Summary
            </h4>
            <p className="text-xs text-[#6B553F] leading-relaxed font-medium">{candidate.summary}</p>
          </div>
        )}
      </div>

      {/* Experience Timeline */}
      <div className="clay-card rounded-[28px] p-7 bg-[#FFFCF7] border border-[#F0E4D3]">
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-[#F0E4D3]">
          <div className="p-2 rounded-xl bg-[#FFEDD5] clay-icon-blob">
            <Briefcase className="w-5 h-5 text-[#EA580C]" />
          </div>
          <h3 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
            Work Experience Timeline
          </h3>
        </div>

        {candidate.experience && candidate.experience.length > 0 ? (
          <div className="space-y-6">
            {candidate.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-[#FDBA74] space-y-1.5">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[#EA580C]" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <h4 className="font-extrabold text-[#2A1B0F]">{exp.title}</h4>
                  <span className="text-[#8B7355] font-bold">{exp.duration || `${exp.years} yrs`}</span>
                </div>
                {exp.company && <p className="text-xs text-[#C2410C] font-extrabold">{exp.company}</p>}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-[#6B553F] list-disc list-inside font-medium">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full bg-[#F5EAD9] text-[10px] text-[#7C5A3A] font-bold clay-inset-pill border border-[#EBDCC4]">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8B7355]">No work experience entries recorded.</p>
        )}
      </div>

      {/* Education & Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education */}
        <div className="clay-card rounded-[28px] p-6 space-y-4 bg-[#FFFCF7] border border-[#F0E4D3]">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#F0E4D3]">
            <div className="p-2 rounded-xl bg-[#FEF3C7] clay-icon-blob">
              <BookOpen className="w-5 h-5 text-[#B45309]" />
            </div>
            <h3 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
              Education
            </h3>
          </div>
          {candidate.education && candidate.education.length > 0 ? (
            <div className="space-y-4">
              {candidate.education.map((edu, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <p className="font-extrabold text-[#2A1B0F]">{edu.degree}</p>
                  <p className="text-[#6B553F] font-medium">{edu.institution}</p>
                  {edu.graduation_year && (
                    <span className="inline-block text-[10px] font-extrabold text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full clay-badge border border-[#FDE68A]">
                      Graduated {edu.graduation_year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8B7355]">No education entries extracted.</p>
          )}
        </div>

        {/* Projects */}
        <div className="clay-card rounded-[28px] p-6 space-y-4 bg-[#FFFCF7] border border-[#F0E4D3]">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#F0E4D3]">
            <div className="p-2 rounded-xl bg-[#F3E8FF] clay-icon-blob">
              <FolderGit2 className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <h3 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
              Key Projects
            </h3>
          </div>
          {candidate.projects && candidate.projects.length > 0 ? (
            <div className="space-y-4">
              {candidate.projects.map((proj, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <p className="font-extrabold text-[#2A1B0F]">{proj.name}</p>
                  {proj.description && <p className="text-[#6B553F] font-medium">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.technologies.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-[#F5EAD9] text-[10px] font-bold text-[#7C5A3A] clay-inset-pill border border-[#EBDCC4]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8B7355]">No featured projects listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};
