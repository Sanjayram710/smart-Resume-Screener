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

  const handleLoadSample = (
    type: 'backend' | 'frontend' | 'ml' | 'devops' | 'fullstack' | 'data' | 'security'
  ) => {
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
    } else if (type === 'devops') {
      setTitle('Principal DevOps & Cloud Infrastructure Engineer');
      setCompany('CloudScale Systems');
      setDescription(
        'We are looking for a Principal DevOps & Cloud Engineer to lead our cloud platform infrastructure, Kubernetes clusters, and automated CI/CD release engineering. You will manage multi-region AWS infrastructure using Terraform and automate observability.\n\nQualifications:\n- 4+ years managing production AWS environments and Kubernetes clusters (EKS).\n- Strong proficiency in Terraform infrastructure-as-code, Docker, and GitHub Actions CI/CD pipelines.\n- Experience in Linux systems administration, Prometheus/Grafana monitoring, and Python/Bash scripting.'
      );
      setRequiredSkills(['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux', 'Python']);
      setPreferredSkills(['Prometheus', 'Grafana', 'Helm', 'Ansible', 'ArgoCD']);
      setMinExp(4.0);
      setEducation("Bachelor's Degree in Computer Science or Computer Engineering");
    } else if (type === 'fullstack') {
      setTitle('Full Stack TypeScript / Next.js Engineer');
      setCompany('NexGen Digital');
      setDescription(
        'Seeking an agile Full Stack Engineer to build fast, responsive enterprise SaaS applications. You will create modern user interfaces using Next.js/React and scale backend APIs in Node.js/TypeScript with PostgreSQL and Redis caching.\n\nQualifications:\n- 3+ years experience across React, Next.js, Node.js, and TypeScript.\n- Deep understanding of relational databases (PostgreSQL/Prisma), REST & GraphQL APIs.\n- Expertise in Tailwind CSS and state management.'
      );
      setRequiredSkills(['TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'REST API']);
      setPreferredSkills(['GraphQL', 'Redis', 'Docker', 'Prisma', 'Tailwind CSS']);
      setMinExp(3.0);
      setEducation("Bachelor's Degree in Computer Science or Software Development");
    } else if (type === 'data') {
      setTitle('Senior Data & Analytics Engineer');
      setCompany('DataCore Insights');
      setDescription(
        'We are seeking a Senior Data Engineer to design high-throughput ETL/ELT pipelines and modern lakehouse architectures. You will orchestrate data processing jobs using Apache Spark, Snowflake, and Apache Airflow.\n\nQualifications:\n- 4+ years of data engineering experience with Python and advanced SQL.\n- Production experience with distributed computing (Apache Spark, Databricks) and cloud warehouses (Snowflake, BigQuery).\n- Hands-on data modeling and orchestration with dbt and Apache Airflow.'
      );
      setRequiredSkills(['Python', 'SQL', 'Apache Spark', 'Snowflake', 'Apache Airflow', 'ETL']);
      setPreferredSkills(['dbt', 'Kafka', 'AWS', 'Databricks', 'Docker']);
      setMinExp(4.0);
      setEducation("Bachelor's or Master's in Data Engineering, Computer Science, or Statistics");
    } else if (type === 'security') {
      setTitle('Information Security & SecOps Engineer');
      setCompany('CyberShield Security');
      setDescription(
        'We are seeking a Cybersecurity Engineer to safeguard cloud environments and lead vulnerability assessments, SIEM monitoring, and incident response. You will collaborate with engineering teams to embed DevSecOps security best practices.\n\nQualifications:\n- 3+ years in cloud security, vulnerability management, and threat detection.\n- Hands-on experience with SIEM tools (Splunk/Elastic), penetration testing, and AWS security controls.\n- Experience implementing compliance frameworks like SOC 2, ISO 27001, and NIST.'
      );
      setRequiredSkills(['Cybersecurity', 'SIEM', 'Vulnerability Assessment', 'AWS', 'Python', 'Network Security']);
      setPreferredSkills(['Penetration Testing', 'SOC 2', 'Splunk', 'Terraform', 'Docker']);
      setMinExp(3.5);
      setEducation("Bachelor's Degree in Cybersecurity or Information Systems");
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
      {/* Quick Template Picker (Molded Warm Clay Container) */}
      <div className="clay-card p-5 rounded-[28px] space-y-3 bg-[#FFFCF7] border border-[#F0E4D3]">
        <div className="flex items-center space-x-2 text-xs text-[#6B553F]">
          <Sparkles className="w-4 h-4 text-[#EA580C]" />
          <span className="font-extrabold text-[#2A1B0F]">Quick Demo Templates (Click to Auto-fill):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleLoadSample('backend')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#4A3520] clay-btn-secondary"
          >
            Backend (Python)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('frontend')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#4A3520] clay-btn-secondary"
          >
            Frontend (React)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('ml')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#4A3520] clay-btn-secondary"
          >
            AI / ML Engineer
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('devops')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#4A3520] clay-btn-secondary"
          >
            DevOps & Cloud
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('fullstack')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#4A3520] clay-btn-secondary"
          >
            Full Stack (TS/Next)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('data')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#4A3520] clay-btn-secondary"
          >
            Data & Analytics
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('security')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#4A3520] clay-btn-secondary"
          >
            Cybersecurity
          </button>
        </div>
      </div>

      <div className="clay-card rounded-[32px] p-7 sm:p-8 space-y-6 bg-[#FFFCF7] border border-[#F0E4D3]">
        {/* Title & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-[#2A1B0F] mb-2">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full px-4 py-3 rounded-2xl clay-inset text-[#2A1B0F] text-sm focus:outline-none focus:border-[#FDBA74] transition-colors placeholder:text-[#8B7355] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#2A1B0F] mb-2">
              Hiring Company <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Antigravity Inc."
              className="w-full px-4 py-3 rounded-2xl clay-inset text-[#2A1B0F] text-sm focus:outline-none focus:border-[#FDBA74] transition-colors placeholder:text-[#8B7355] font-medium"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-extrabold text-[#2A1B0F] mb-2">
            Full Job Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste complete job description, duties, requirements, and qualifications..."
            className="w-full px-4 py-3 rounded-2xl clay-inset text-[#2A1B0F] text-sm focus:outline-none focus:border-[#FDBA74] transition-colors placeholder:text-[#8B7355] leading-relaxed font-medium"
          />
        </div>

        {/* Required Skills Tag Input */}
        <div>
          <label className="block text-xs font-extrabold text-[#2A1B0F] mb-2">
            Mandatory Required Skills (Weight: 75% of skill score)
          </label>
          <div className="flex space-x-2.5">
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
              className="flex-1 px-4 py-2.5 rounded-full clay-inset text-[#2A1B0F] text-xs focus:outline-none focus:border-[#FDBA74] placeholder:text-[#8B7355] font-medium"
            />
            <button
              type="button"
              onClick={handleAddRequiredSkill}
              className="px-4 py-2 text-xs font-bold text-[#4A3520] clay-btn-secondary flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
          {requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold clay-inset-pill bg-[#F5EAD9] text-[#6B4A2C] border border-[#EBDCC4]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(skill)}
                    className="ml-1.5 text-[#A05A2C] hover:text-[#C2410C]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Preferred Skills Tag Input */}
        <div>
          <label className="block text-xs font-extrabold text-[#2A1B0F] mb-2">
            Preferred / Bonus Skills (Weight: 25% of skill score)
          </label>
          <div className="flex space-x-2.5">
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
              className="flex-1 px-4 py-2.5 rounded-full clay-inset text-[#2A1B0F] text-xs focus:outline-none focus:border-[#FDBA74] placeholder:text-[#8B7355] font-medium"
            />
            <button
              type="button"
              onClick={handleAddPreferredSkill}
              className="px-4 py-2 text-xs font-bold text-[#4A3520] clay-btn-secondary flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
          {preferredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {preferredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold clay-inset-pill bg-[#FAF0E1] text-[#9A7049] border border-[#EBDCC4]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removePreferredSkill(skill)}
                    className="ml-1.5 text-[#B45309] hover:text-[#EA580C]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Minimum Experience & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-[#2A1B0F] mb-2">
              Minimum Required Experience (Years): <span className="text-[#EA580C] font-extrabold">{minExp} yrs</span>
            </label>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={minExp}
              onChange={(e) => setMinExp(parseFloat(e.target.value))}
              className="w-full accent-[#EA580C] bg-[#EBDCC4] h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#2A1B0F] mb-2">
              Education Requirement
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. Bachelor's in Computer Science"
              className="w-full px-4 py-2.5 rounded-full clay-inset text-[#2A1B0F] text-xs focus:outline-none focus:border-[#FDBA74] placeholder:text-[#8B7355] font-medium"
            />
          </div>
        </div>

        {/* AI Auto-extract checkbox */}
        <div className="flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            id="autoExtract"
            checked={autoExtract}
            onChange={(e) => setAutoExtract(e.target.checked)}
            className="w-4 h-4 rounded text-[#EA580C] focus:ring-[#EA580C] bg-[#F5EAD9] border-[#EBDCC4]"
          />
          <label htmlFor="autoExtract" className="text-xs text-[#4A3520] font-bold flex items-center space-x-2 cursor-pointer">
            <Bot className="w-4 h-4 text-[#EA580C]" />
            <span>Enable AI Auto-Extraction to parse requirements & generate embeddings</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 text-sm font-extrabold text-white clay-btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <Bot className="w-4 h-4" />
          <span>{isLoading ? 'Creating Job...' : 'Create Job & Initialize Screener'}</span>
        </button>
      </div>
    </form>
  );
};
