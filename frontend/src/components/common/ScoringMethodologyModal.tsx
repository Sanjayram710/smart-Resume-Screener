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
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
      description:
        'Calculates exact token matching (75% of skill score) plus canonical alias and technology family clusters (25% preferred bonus skills, e.g. React.js → React, PostgreSQL → SQL Database).',
    },
    {
      step: '02',
      title: 'Experience Seniority Curve',
      weight: '25%',
      icon: Briefcase,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/30',
      description:
        'Evaluates candidate verified career years against role minimum experience requirements using a continuous, non-linear seniority scoring curve.',
    },
    {
      step: '03',
      title: 'Semantic Vector Relevance',
      weight: '20%',
      icon: Cpu,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30',
      description:
        'Generates dense text embeddings of the sanitized candidate background and computes cosine similarity against the full job description spec.',
    },
    {
      step: '04',
      title: 'Education Hierarchy',
      weight: '10%',
      icon: BookOpen,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      description:
        'Evaluates degree qualifications based on structured hierarchical tiering (PhD > Master’s > Bachelor’s > Associate / Self-Taught).',
    },
    {
      step: '05',
      title: 'Industry Certifications',
      weight: '5%',
      icon: Award,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      description:
        'Verifies technical, cloud, and domain-specific certifications (e.g. AWS Certified Solutions Architect, CKA, PMP).',
    },
    {
      step: '06',
      title: 'LLM Qualitative Justification',
      weight: 'Qualitative Synthesis',
      icon: Sparkles,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      description:
        'Synthesizes strengths, missing critical skills, and detailed evidence-grounded commentary explaining the hiring decision without hallucinating scores.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Transparent & Explainable Hiring Architecture</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 font-['Outfit']">
              6-Stage Deterministic Scoring & AI Framework
            </h2>
            <p className="text-xs text-slate-300">
              Unlike opaque black-box AI tools, every candidate score (1.0 – 10.0) is mathematically
              computed using weighted multi-criteria algorithms.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bias Redaction Callout */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Protected Demographic Bias Redaction Engine</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Prior to scoring and evaluation, all resume text passes through an automated regex and
            token sanitation layer that strips protected attributes (gender pronouns, age, race,
            marital status, nationality, and religious references). The mathematical matching model
            and LLM evaluate purely on skills, verified career milestones, and qualifications.
          </p>
        </div>

        {/* 6 Stages Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-['Outfit'] flex items-center space-x-2">
            <Percent className="w-4 h-4 text-emerald-400" />
            <span>Scoring Stages & Weight Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg ${stage.bg} ${stage.color} flex items-center justify-center flex-shrink-0 border`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          STAGE {stage.step}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100">{stage.title}</h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-emerald-300 border border-slate-700">
                      {stage.weight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{stage.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mathematical Formula & Thresholds */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-['Outfit']">
            Deterministic Formula & Recruiter Action Thresholds
          </h4>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-xs text-emerald-300 overflow-x-auto">
            Overall Score = max(1.0, min(10.0, round((0.40*S_skill + 0.25*S_exp + 0.20*S_sem + 0.10*S_edu + 0.05*S_cert)/10, 1)))
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-center">
              <span className="text-xs font-bold text-emerald-300 block">SHORTLIST</span>
              <span className="text-xs text-emerald-200 font-mono">Score ≥ 7.0</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-500/30 text-center">
              <span className="text-xs font-bold text-amber-300 block">REVIEW</span>
              <span className="text-xs text-amber-200 font-mono">5.0 ≤ Score &lt; 7.0</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-center">
              <span className="text-xs font-bold text-rose-300 block">NOT RECOMMENDED</span>
              <span className="text-xs text-rose-200 font-mono">Score &lt; 5.0</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg transition-colors flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got It</span>
          </button>
        </div>
      </div>
    </div>
  );
};
