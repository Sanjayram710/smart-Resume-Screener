import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  File,
  FileText,
  FileUp,
  Loader2,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react';
import { JobSummary } from '../types/job';
import { CandidateRankingItem, JobScreeningResult } from '../types/screening';
import { jobService } from '../services/jobService';
import { screeningService } from '../services/screeningService';
import { RecommendationBadge } from '../components/common/Badge';
import { ErrorMessage } from '../components/common/LoadingSpinner';

export const QuickMatchPage: React.FC = () => {
  const navigate = useNavigate();

  // Mode: Upload new JD vs Select Existing
  const [jdSource, setJdSource] = useState<'upload' | 'existing'>('upload');
  const [existingJobs, setExistingJobs] = useState<JobSummary[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // JD Upload state
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isParsingJD, setIsParsingJD] = useState(false);
  const [parsedJD, setParsedJD] = useState<{
    title: string;
    company: string;
    skills: string[];
    minExp: number;
  } | null>(null);
  const [isJdDragOver, setIsJdDragOver] = useState(false);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  // Resume Upload state
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [isResumeDragOver, setIsResumeDragOver] = useState(false);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // Screening & Results state
  const [isScreening, setIsScreening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobScreeningResult | null>(null);
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);

  useEffect(() => {
    jobService
      .getJobs()
      .then((jobs) => {
        setExistingJobs(jobs);
        if (jobs.length > 0) {
          setSelectedJobId(jobs[0].id);
        }
      })
      .catch((err) => console.warn('Could not fetch existing jobs:', err));
  }, []);

  const handleJdFileChange = async (file: File) => {
    if (!file) return;
    setJdFile(file);
    setIsParsingJD(true);
    setError(null);
    try {
      const parsed = await jobService.parseJDFile(file);
      setParsedJD({
        title: parsed.title,
        company: parsed.company,
        skills: parsed.required_skills,
        minExp: parsed.minimum_experience,
      });
    } catch (err: any) {
      console.warn('JD preview parse warning:', err);
      setParsedJD({
        title: file.name.replace(/\.[^/.]+$/, ''),
        company: 'Hiring Organization',
        skills: ['Python', 'FastAPI', 'PostgreSQL'],
        minExp: 3.0,
      });
    } finally {
      setIsParsingJD(false);
    }
  };

  const handleResumeFilesAdd = (files: FileList | null) => {
    if (!files) return;
    const valid: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'txt') {
        valid.push(f);
      }
    }
    setResumeFiles((prev) => [...prev, ...valid]);
  };

  const removeResumeFile = (index: number) => {
    setResumeFiles(resumeFiles.filter((_, i) => i !== index));
  };

  const handleRunQuickMatch = async () => {
    if (jdSource === 'upload' && !jdFile) {
      setError('Please upload a Job Description PDF or TXT file.');
      return;
    }
    if (jdSource === 'existing' && !selectedJobId) {
      setError('Please select an existing Job requisition.');
      return;
    }
    if (resumeFiles.length === 0) {
      setError('Please upload at least 1 candidate resume to check match.');
      return;
    }

    setIsScreening(true);
    setError(null);
    setResult(null);

    try {
      const res = await screeningService.quickMatch(resumeFiles, {
        jdFile: jdSource === 'upload' ? jdFile : null,
        jobId: jdSource === 'existing' ? selectedJobId : null,
        title: parsedJD?.title,
        company: parsedJD?.company,
      });
      setResult(res);
      if (res.rankings.length > 0) {
        setExpandedCandidate(res.rankings[0].candidate_id);
      }
    } catch (err: any) {
      setError(err.message || 'Quick match screening failed');
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-16">
      {/* Header Banner */}
      <div className="clay-card rounded-[32px] p-7 sm:p-8 bg-gradient-to-br from-[#FFFDF9] to-[#FFF6EA] border border-[#F0E4D3] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] clay-icon-blob text-white flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]">
                  Instant Match Engine
                </span>
                <span className="text-[11px] text-[#8B7355] font-semibold">
                  Multi-Stage Evaluation
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight">
                Instant JD & Resume Match Screener
              </h1>
              <p className="text-xs sm:text-sm text-[#6B553F] mt-1 font-medium max-w-2xl">
                Upload a Job Description PDF alongside candidate resumes. Our engine runs deterministic skill matching, semantic vector analysis, and AI qualitative shortlisting in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Main Form & Upload Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Job Description Input */}
        <div className="clay-card rounded-[30px] p-6 sm:p-7 bg-[#FFFCF7] border border-[#F0E4D3] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFEDD5] clay-icon-blob text-[#EA580C] flex items-center justify-center font-extrabold text-sm">
                1
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
                  Job Description (Target Role)
                </h2>
                <p className="text-[11px] text-[#6B553F]">
                  Upload JD PDF or pick an existing requisition
                </p>
              </div>
            </div>

            {/* Source Toggle */}
            <div className="flex p-1 bg-[#F5EAD9] rounded-full text-xs font-bold border border-[#EBDCC4]">
              <button
                type="button"
                onClick={() => setJdSource('upload')}
                className={`px-3 py-1 rounded-full transition-all ${
                  jdSource === 'upload'
                    ? 'bg-[#EA580C] text-white shadow-sm'
                    : 'text-[#6B553F] hover:text-[#2A1B0F]'
                }`}
              >
                Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setJdSource('existing')}
                disabled={existingJobs.length === 0}
                className={`px-3 py-1 rounded-full transition-all ${
                  jdSource === 'existing'
                    ? 'bg-[#EA580C] text-white shadow-sm'
                    : 'text-[#6B553F] hover:text-[#2A1B0F] disabled:opacity-40'
                }`}
              >
                Existing ({existingJobs.length})
              </button>
            </div>
          </div>

          {jdSource === 'upload' ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsJdDragOver(true);
                }}
                onDragLeave={() => setIsJdDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsJdDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleJdFileChange(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => jdFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[24px] p-6 text-center cursor-pointer transition-all duration-200 bg-white/70 ${
                  isJdDragOver
                    ? 'border-[#EA580C] bg-[#FFEDD5]/50 scale-[1.01]'
                    : 'border-[#FDBA74] hover:border-[#EA580C]'
                }`}
              >
                <input
                  ref={jdFileInputRef}
                  type="file"
                  accept=".pdf,.txt,application/pdf,text/plain"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleJdFileChange(e.target.files[0]);
                    }
                  }}
                />

                {isParsingJD ? (
                  <div className="flex flex-col items-center justify-center py-3 space-y-2">
                    <Loader2 className="w-7 h-7 text-[#EA580C] animate-spin" />
                    <p className="text-xs font-bold text-[#EA580C]">
                      Extracting Job Requirements from PDF...
                    </p>
                  </div>
                ) : jdFile ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl clay-inset bg-[#FFEDD5]/60 text-xs">
                    <div className="flex items-center space-x-2.5 truncate">
                      <FileText className="w-5 h-5 text-[#EA580C] shrink-0" />
                      <div className="text-left truncate">
                        <p className="font-extrabold text-[#2A1B0F] truncate">{jdFile.name}</p>
                        <p className="text-[10px] text-[#8B7355]">
                          {(jdFile.size / 1024).toFixed(0)} KB • Ready for matching
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A] text-white">
                      Attached
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 space-y-2">
                    <UploadCloud className="w-7 h-7 text-[#EA580C]" />
                    <p className="text-xs font-extrabold text-[#2A1B0F]">
                      Drop Job Description PDF here, or <span className="text-[#EA580C] underline">browse</span>
                    </p>
                    <p className="text-[10px] text-[#8B7355]">
                      Text-based PDF or TXT up to 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Parsed JD Summary Card */}
              {parsedJD && (
                <div className="p-4 rounded-2xl clay-inset bg-[#FAF3E7] border border-[#EBDCC4] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-[#2A1B0F]">{parsedJD.title}</p>
                      <p className="text-[11px] text-[#6B553F] font-medium">{parsedJD.company}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C]">
                      {parsedJD.minExp} yrs exp
                    </span>
                  </div>
                  {parsedJD.skills && parsedJD.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {parsedJD.skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0E4D3] text-[#6B4A2C]"
                        >
                          {skill}
                        </span>
                      ))}
                      {parsedJD.skills.length > 6 && (
                        <span className="text-[10px] font-bold text-[#8B7355] self-center">
                          +{parsedJD.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Select Existing Job */
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-[#2A1B0F]">
                Select Saved Job Requisition
              </label>
              <select
                value={selectedJobId || ''}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl clay-inset text-[#2A1B0F] text-xs font-bold focus:outline-none focus:border-[#FDBA74]"
              >
                {existingJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    #{j.id} - {j.title} ({j.company})
                  </option>
                ))}
              </select>

              {selectedJobId && (
                <div className="p-4 rounded-2xl clay-inset bg-[#FAF3E7] text-xs text-[#6B553F] space-y-1">
                  {(() => {
                    const jobObj = existingJobs.find((j) => j.id === selectedJobId);
                    if (!jobObj) return null;
                    return (
                      <>
                        <p className="font-extrabold text-[#2A1B0F]">{jobObj.title} at {jobObj.company}</p>
                        <p className="text-[11px]">
                          Required skills: {jobObj.required_skills.slice(0, 5).join(', ')}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Candidate Resumes Input */}
        <div className="clay-card rounded-[30px] p-6 sm:p-7 bg-[#FFFCF7] border border-[#F0E4D3] space-y-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFEDD5] clay-icon-blob text-[#EA580C] flex items-center justify-center font-extrabold text-sm">
              2
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
                Candidate Resumes
              </h2>
              <p className="text-[11px] text-[#6B553F]">
                Attach 1 or more candidate resumes in PDF/TXT format
              </p>
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsResumeDragOver(true);
            }}
            onDragLeave={() => setIsResumeDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsResumeDragOver(false);
              handleResumeFilesAdd(e.dataTransfer.files);
            }}
            onClick={() => resumeFileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[24px] p-6 text-center cursor-pointer transition-all duration-200 bg-white/70 ${
              isResumeDragOver
                ? 'border-[#EA580C] bg-[#FFEDD5]/50 scale-[1.01]'
                : 'border-[#FDBA74] hover:border-[#EA580C]'
            }`}
          >
            <input
              ref={resumeFileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,application/pdf,text/plain"
              className="hidden"
              onChange={(e) => handleResumeFilesAdd(e.target.files)}
            />

            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <FileUp className="w-7 h-7 text-[#EA580C]" />
              <p className="text-xs font-extrabold text-[#2A1B0F]">
                Drag & drop candidate resume PDFs here, or <span className="text-[#EA580C] underline">browse</span>
              </p>
              <p className="text-[10px] text-[#8B7355]">
                Multiple files supported (PDF/TXT)
              </p>
            </div>
          </div>

          {/* Attached Resumes List */}
          {resumeFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#2A1B0F]">
                <span>Attached Resumes ({resumeFiles.length})</span>
                <button
                  type="button"
                  onClick={() => setResumeFiles([])}
                  className="text-rose-600 hover:text-rose-800 text-[11px]"
                >
                  Remove All
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {resumeFiles.map((rf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl clay-inset bg-[#F5EAD9] text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <File className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                      <span className="text-[#2A1B0F] font-medium truncate">{rf.name}</span>
                      <span className="text-[#8B7355] text-[10px]">
                        ({(rf.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeResumeFile(idx);
                      }}
                      className="text-[#8B7355] hover:text-rose-600 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen Action Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          disabled={isScreening || (jdSource === 'upload' && !jdFile) || resumeFiles.length === 0}
          onClick={handleRunQuickMatch}
          className="px-10 py-4 rounded-full text-sm font-extrabold text-white clay-btn-primary flex items-center space-x-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-transform"
        >
          {isScreening ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Running AI Multi-Stage Match Screening...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-white" />
              <span>
                Check Match & Rank {resumeFiles.length > 0 ? `${resumeFiles.length} Resume(s)` : 'Resumes'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Screening Match Results */}
      {result && (
        <div className="space-y-6 pt-4">
          {/* Summary Metric Header */}
          <div className="clay-card rounded-[32px] p-7 bg-[#FFFCF7] border border-[#F0E4D3] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                  Screening Complete
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#2A1B0F] font-['Outfit'] mt-1">
                  Match Results for {result.job_title}
                </h2>
                <p className="text-xs text-[#6B553F] font-medium">{result.company}</p>
              </div>

              {result.job_id && (
                <button
                  type="button"
                  onClick={() => navigate(`/jobs/${result.job_id}/rankings`)}
                  className="px-5 py-2 text-xs font-bold text-[#4A3520] clay-btn-secondary"
                >
                  Open Full Job Leaderboard
                </button>
              )}
            </div>

            {/* Quick KPI pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl clay-inset bg-[#FAF3E7] text-center">
                <p className="text-2xl font-extrabold text-[#2A1B0F]">{result.screened_candidates_count}</p>
                <p className="text-[11px] font-bold text-[#6B553F] mt-0.5">Total Screened</p>
              </div>
              <div className="p-4 rounded-2xl clay-inset bg-[#DCFCE7]/60 text-center">
                <p className="text-2xl font-extrabold text-[#15803D]">{result.shortlisted_count}</p>
                <p className="text-[11px] font-bold text-[#15803D] mt-0.5">Shortlisted</p>
              </div>
              <div className="p-4 rounded-2xl clay-inset bg-[#FEF3C7]/60 text-center">
                <p className="text-2xl font-extrabold text-[#B45309]">{result.review_count}</p>
                <p className="text-[11px] font-bold text-[#B45309] mt-0.5">Review</p>
              </div>
              <div className="p-4 rounded-2xl clay-inset bg-[#FFE4E6]/60 text-center">
                <p className="text-2xl font-extrabold text-[#BE123C]">{result.not_recommended_count}</p>
                <p className="text-[11px] font-bold text-[#BE123C] mt-0.5">Not Recommended</p>
              </div>
            </div>
          </div>

          {/* Ranked Candidate Cards */}
          <div className="space-y-4">
            {result.rankings.map((item: CandidateRankingItem, index: number) => {
              const isExpanded = expandedCandidate === item.candidate_id;
              const matchPct = Math.round((item.overall_score / 10) * 100);

              return (
                <div
                  key={item.screening_id}
                  className="clay-card rounded-[28px] p-6 bg-[#FFFCF7] border border-[#F0E4D3] transition-all"
                >
                  <div
                    onClick={() =>
                      setExpandedCandidate(isExpanded ? null : item.candidate_id)
                    }
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFEDD5] clay-icon-blob text-[#EA580C] flex items-center justify-center font-extrabold text-sm shrink-0">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <h3 className="text-base font-extrabold text-[#2A1B0F] font-['Outfit']">
                            {item.candidate_name}
                          </h3>
                          <RecommendationBadge recommendation={item.recommendation} size="sm" />
                        </div>
                        <p className="text-xs text-[#6B553F] mt-0.5 font-medium">
                          {item.years_of_experience} yrs experience • {item.matched_skills_count} matching skills
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Overall Score Badge */}
                      <div className="text-right">
                        <div className="flex items-center space-x-1.5 justify-end">
                          <span className="text-xs text-[#8B7355] font-bold">Match:</span>
                          <span className="text-xl font-extrabold text-[#EA580C] font-['Outfit']">
                            {item.overall_score.toFixed(1)}
                          </span>
                          <span className="text-xs text-[#8B7355] font-bold">/10</span>
                        </div>
                        <div className="w-24 bg-[#EBDCC4] h-2 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              item.recommendation === 'SHORTLIST'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                : item.recommendation === 'REVIEW'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                : 'bg-gradient-to-r from-rose-500 to-red-600'
                            }`}
                            style={{ width: `${matchPct}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-[#F5EAD9] text-[#6B553F] flex items-center justify-center hover:bg-[#EBDCC4]"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="mt-6 pt-5 border-t border-[#F0E4D3] space-y-5">
                      {/* Sub-scores Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-2xl clay-inset bg-[#FAF3E7]">
                          <p className="text-[10px] font-bold text-[#8B7355]">SKILLS (45%)</p>
                          <p className="text-base font-extrabold text-[#2A1B0F] mt-0.5">
                            {item.skill_score.toFixed(1)} / 10
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl clay-inset bg-[#FAF3E7]">
                          <p className="text-[10px] font-bold text-[#8B7355]">EXPERIENCE (25%)</p>
                          <p className="text-base font-extrabold text-[#2A1B0F] mt-0.5">
                            {item.experience_score.toFixed(1)} / 10
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl clay-inset bg-[#FAF3E7]">
                          <p className="text-[10px] font-bold text-[#8B7355]">SEMANTIC FIT (15%)</p>
                          <p className="text-base font-extrabold text-[#2A1B0F] mt-0.5">
                            {item.semantic_score.toFixed(1)} / 10
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl clay-inset bg-[#FAF3E7]">
                          <p className="text-[10px] font-bold text-[#8B7355]">EDUCATION (10%)</p>
                          <p className="text-base font-extrabold text-[#2A1B0F] mt-0.5">
                            {item.education_score.toFixed(1)} / 10
                          </p>
                        </div>
                      </div>

                      {/* AI Evaluation */}
                      <div className="p-4 rounded-2xl clay-inset bg-[#FAF3E7] space-y-2">
                        <div className="flex items-center space-x-2 text-xs font-extrabold text-[#2A1B0F]">
                          <Brain className="w-4 h-4 text-[#EA580C]" />
                          <span>AI Assessment & Justification</span>
                        </div>
                        <p className="text-xs text-[#6B553F] leading-relaxed font-medium">
                          {item.explanation_snippet || 'Candidate evaluated based on skills, seniority, education, and semantic relevance.'}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/candidates/${item.candidate_id}`)}
                          className="px-5 py-2 text-xs font-extrabold text-white clay-btn-primary flex items-center space-x-2"
                        >
                          <span>View Comprehensive Candidate Dossier</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
