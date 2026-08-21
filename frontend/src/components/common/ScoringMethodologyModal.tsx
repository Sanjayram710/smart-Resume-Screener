import React from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Percent,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

interface ScoringMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoringMethodologyModal: React.FC<ScoringMethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const stages = [
    {
      step: '01',
      title: 'Skills Match Matrix',
      weight: '40%',
      icon: Code2,
      color: 'text-[#EA580C]',
      bg: 'bg-[#FFEDD5] border-[#FDBA74]',
      description:
        'Calculates exact token matching (75% of skill score) plus canonical alias and technology family clusters (25% preferred bonus skills, e.g. React.js → React, PostgreSQL → SQL Database).',
    },
    {
      step: '02',
      title: 'Experience Seniority Curve',
      weight: '25%',
      icon: Briefcase,
      color: 'text-[#0284C7]',
      bg: 'bg-[#E0F2FE] border-[#BAE6FD]',
      description:
        'Evaluates candidate verified career years against role minimum experience requirements using a continuous, non-linear seniority scoring curve.',
    },
    {
      step: '03',
      title: 'Semantic Vector Relevance',
      weight: '20%',
      icon: Cpu,
      color: 'text-[#7C3AED]',
      bg: 'bg-[#F3E8FF] border-[#DDD6FE]',
      description:
        'Generates dense text embeddings of the sanitized candidate background and computes cosine similarity against the full job description spec.',
    },
    {
      step: '04',
      title: 'Education Hierarchy',
      weight: '10%',
      icon: BookOpen,
      color: 'text-[#15803D]',
      bg: 'bg-[#DCFCE7] border-[#86EFAC]',
      description:
        'Evaluates degree qualifications based on structured hierarchical tiering (PhD > Master’s > Bachelor’s > Associate / Self-Taught).',
    },
    {
      step: '05',
      title: 'Industry Certifications',
      weight: '5%',
      icon: Award,
      color: 'text-[#B45309]',
      bg: 'bg-[#FEF3C7] border-[#FDE68A]',
      description:
        'Verifies technical, cloud, and domain-specific certifications (e.g. AWS Certified Solutions Architect, CKA, PMP).',
    },
    {
      step: '06',
      title: 'LLM Qualitative Justification',
      weight: 'Qualitative Synthesis',
      icon: Sparkles,
      color: 'text-[#0D9488]',
      bg: 'bg-[#CCFBF1] border-[#99F6E4]',
      description:
        'Synthesizes strengths, missing critical skills, and detailed evidence-grounded commentary explaining the hiring decision without hallucinating scores.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl clay-card bg-[#FFFCF7] shadow-[0_25px_70px_rgba(180,110,40,0.25)] p-7 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto rounded-[32px] border border-[#F0E4D3]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F0E4D3] pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFEDD5] border border-[#FDBA74] text-[#C2410C] text-xs font-bold clay-badge">
              <Layers className="w-3.5 h-3.5" />
              <span>Transparent & Explainable Hiring Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight">
              6-Stage Deterministic Scoring & AI Framework
            </h2>
            <p className="text-xs text-[#6B553F] font-medium">
              Unlike opaque black-box AI tools, every candidate score (1.0 – 10.0) is mathematically
              computed using weighted multi-criteria algorithms.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B553F] hover:text-[#2A1B0F] clay-btn-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bias Redaction Callout */}
        <div className="p-5 rounded-[24px] clay-card bg-[#FFF7ED] border border-[#FED7AA] space-y-2">
          <div className="flex items-center space-x-2.5 text-[#C2410C] font-extrabold text-sm">
            <div className="p-2 rounded-xl bg-[#FFEDD5] clay-icon-blob">
              <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
            </div>
            <span>Protected Demographic Bias Redaction Engine</span>
          </div>
          <p className="text-xs text-[#7C2D12] leading-relaxed pl-10 font-medium">
            Prior to scoring and evaluation, all resume text passes through an automated regex and
            token sanitation layer that strips protected attributes (gender pronouns, age, race,
            marital status, nationality, and religious references). The mathematical matching model
            and LLM evaluate purely on skills, verified career milestones, and qualifications.
          </p>
        </div>

        {/* 6 Stages Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-[#2A1B0F] uppercase tracking-wider font-['Outfit'] flex items-center space-x-2">
            <Percent className="w-4 h-4 text-[#EA580C]" />
            <span>Scoring Stages & Weight Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="p-4 rounded-[22px] clay-card bg-[#FAF3E7] border border-[#F0E4D3] flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-2xl ${stage.bg} ${stage.color} clay-icon-blob flex items-center justify-center flex-shrink-0 border`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#8B7355]">
                          STAGE {stage.step}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#2A1B0F]">{stage.title}</h4>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold text-[#C2410C] clay-badge bg-[#FFEDD5] border border-[#FDBA74]">
                      {stage.weight}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B553F] leading-relaxed font-medium">{stage.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mathematical Formula & Thresholds */}
        <div className="p-5 rounded-[24px] clay-card bg-[#FFFCF7] border border-[#F0E4D3] space-y-3.5">
          <h4 className="text-xs font-extrabold text-[#2A1B0F] uppercase tracking-wider font-['Outfit']">
            Deterministic Formula & Recruiter Action Thresholds
          </h4>
          <div className="p-3 rounded-2xl clay-inset font-mono text-xs text-[#C2410C] overflow-x-auto bg-[#F5EAD9] border-[#EBDCC4]">
            Overall Score = max(1.0, min(10.0, round((0.40*S_skill + 0.25*S_exp + 0.20*S_sem + 0.10*S_edu + 0.05*S_cert)/10, 1)))
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-2xl clay-card bg-[#DCFCE7] border border-[#86EFAC] text-center">
              <span className="text-xs font-extrabold text-[#15803D] block">SHORTLIST</span>
              <span className="text-xs text-[#166534] font-mono font-bold">Score ≥ 7.0</span>
            </div>
            <div className="p-3 rounded-2xl clay-card bg-[#FEF3C7] border border-[#FDE68A] text-center">
              <span className="text-xs font-extrabold text-[#92400E] block">REVIEW</span>
              <span className="text-xs text-[#78350F] font-mono font-bold">5.0 ≤ Score &lt; 7.0</span>
            </div>
            <div className="p-3 rounded-2xl clay-card bg-[#FEE2E2] border border-[#FECACA] text-center">
              <span className="text-xs font-extrabold text-[#991B1B] block">NOT RECOMMENDED</span>
              <span className="text-xs text-[#7F1D1D] font-mono font-bold">Score &lt; 5.0</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got It</span>
          </button>
        </div>
      </div>
    </div>
  );
};
