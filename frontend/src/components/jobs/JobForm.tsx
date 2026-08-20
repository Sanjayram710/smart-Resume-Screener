import React, { useState } from 'react';
import { Bot, Plus, Sparkles, X } from 'lucide-react';
import { JobCreatePayload } from '../../types/job';

interface JobFormProps {
  onSubmit: (payload: JobCreatePayload) => Promise<void>;
  isLoading: boolean;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [reqSkillInput, setReqSkillInput] = useState('');
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [minExp, setMinExp] = useState(3.0);
  const [education, setEducation] = useState("Bachelor's Degree in Computer Science or STEM");
  const [autoExtract, setAutoExtract] = useState(true);

  const handleAddRequiredSkill = () => {
    if (reqSkillInput.trim() && !requiredSkills.includes(reqSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, reqSkillInput.trim()]);
      setReqSkillInput('');
    }
  };

  const handleAddPreferredSkill = () => {
    if (prefSkillInput.trim() && !preferredSkills.includes(prefSkillInput.trim())) {
      setPreferredSkills([...preferredSkills, prefSkillInput.trim()]);
      setPrefSkillInput('');
    }
  };

  const removeRequiredSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const removePreferredSkill = (skill: string) => {
    setPreferredSkills(preferredSkills.filter((s) => s !== skill));
  };

  const handleLoadSample = (type: 'backend' | 'frontend' | 'ml') => {
    if (type === 'backend') {
      setTitle('Senior Backend & Cloud Engineer');
      setCompany('Antigravity Technologies');
      setDescription(
        'We are seeking a high-caliber Senior Backend Engineer to architect, build, and maintain our high-throughput distributed microservices. You will collaborate with product and infrastructure teams to design resilient RESTful APIs, optimize PostgreSQL queries, and deploy containerized services onto AWS.\n\nKey Responsibilities:\n- Design scalable backend microservices using Python, FastAPI, and PostgreSQL.\n- Build CI/CD deployment pipelines with Docker and AWS.\n- Write unit and integration tests with Pytest.'
      );
      setRequiredSkills(['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'REST API']);
      setPreferredSkills(['AWS', 'Kubernetes', 'Redis', 'CI/CD']);
      setMinExp(4.0);
      setEducation("Bachelor's Degree in Computer Science or Software Engineering");
    } else if (type === 'frontend') {
      setTitle('Senior Frontend / Fullstack Engineer');
      setCompany('PixelCraft Studios');
      setDescription(
        'Looking for a seasoned Frontend Engineer proficient with React, TypeScript, and modern styling libraries like Tailwind CSS. You will build dynamic recruiter portals and data visualization tools.\n\nQualifications:\n- 3+ years experience in React, TypeScript, and modern JavaScript.\n- Strong expertise in Tailwind CSS, responsive web development, and state management.'
      );
      setRequiredSkills(['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML']);
      setPreferredSkills(['Node.js', 'Next.js', 'REST API', 'Docker']);
      setMinExp(3.0);
      setEducation("Bachelor's in Computer Science or related degree");
    } else if (type === 'ml') {
      setTitle('Machine Learning & NLP Specialist');
      setCompany('Cognitive AI Systems');
      setDescription(
        'We are seeking a Machine Learning Engineer to design and deploy NLP and transformer-based models in production. You will build inference APIs in FastAPI and scale containerized deployments.\n\nQualifications:\n- 3+ years experience in Python, PyTorch/TensorFlow, and Scikit-learn.\n- Proven track record deploying ML models via Docker and FastAPI.'
      );
      setRequiredSkills(['Python', 'PyTorch', 'Scikit-learn', 'Machine Learning', 'NLP']);
      setPreferredSkills(['Docker', 'FastAPI', 'Pandas', 'NumPy']);
      setMinExp(3.0);
      setEducation("Master's or Bachelor's in Computer Science or Data Science");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      company,
      description,
      required_skills: requiredSkills,
      preferred_skills: preferredSkills,
      minimum_experience: minExp,
      education_requirements: education ? [education] : [],
      certifications: [],
      auto_extract: autoExtract,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Template Picker */}
      <div className="glass-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">Quick Demo Templates:</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleLoadSample('backend')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Backend (Python)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('frontend')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Frontend (React)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('ml')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            AI / ML Engineer
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-5">
        {/* Title & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Job Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Hiring Company <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Antigravity Inc."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Full Job Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste complete job description, duties, requirements, and qualifications..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500 leading-relaxed"
          />
        </div>

        {/* Required Skills Tag Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Mandatory Required Skills (Weight: 75% of skill score)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={reqSkillInput}
              onChange={(e) => setReqSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRequiredSkill();
                }
              }}
              placeholder="Type skill & press Add (e.g. Python, FastAPI, PostgreSQL)"
              className="flex-1 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={handleAddRequiredSkill}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
          {requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(skill)}
                    className="ml-1.5 text-emerald-400 hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Preferred Skills Tag Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Preferred / Bonus Skills (Weight: 25% of skill score)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={prefSkillInput}
              onChange={(e) => setPrefSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPreferredSkill();
                }
              }}
              placeholder="Type preferred skill & press Add (e.g. AWS, Kubernetes, Redis)"
              className="flex-1 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={handleAddPreferredSkill}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
          {preferredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {preferredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removePreferredSkill(skill)}
                    className="ml-1.5 text-sky-400 hover:text-sky-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Minimum Experience & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Minimum Required Experience (Years): {minExp} yrs
            </label>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={minExp}
              onChange={(e) => setMinExp(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Education Requirement
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. Bachelor's in Computer Science"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* AI Auto-extract checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="autoExtract"
            checked={autoExtract}
            onChange={(e) => setAutoExtract(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
          />
          <label htmlFor="autoExtract" className="text-xs text-slate-300 flex items-center space-x-1.5 cursor-pointer">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Enable AI Auto-Extraction to parse requirements & generate embeddings</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <Bot className="w-4 h-4" />
          <span>{isLoading ? 'Creating Job...' : 'Create Job & Initialize Screener'}</span>
        </button>
      </div>
    </form>
  );
};
