import api from './api';
import { APIResponse } from '../types/api';
import { JobScreeningResult } from '../types/screening';

export const screeningService = {
  async screenJob(jobId: number): Promise<JobScreeningResult> {
    const res = await api.post<APIResponse<JobScreeningResult>>(`/jobs/${jobId}/screen`);
    return res.data.data;
  },

  async getRankings(jobId: number): Promise<JobScreeningResult> {
    const res = await api.get<APIResponse<JobScreeningResult>>(`/jobs/${jobId}/rankings`);
    return res.data.data;
  },

  async quickMatch(
    resumes: File[],
    options: {
      jdFile?: File | null;
      jobId?: number | null;
      title?: string;
      company?: string;
    }
  ): Promise<JobScreeningResult> {
    const formData = new FormData();
    if (options.jdFile) {
      formData.append('jd_file', options.jdFile);
    }
    if (options.jobId) {
      formData.append('job_id', String(options.jobId));
    }
    if (options.title) {
      formData.append('title', options.title);
    }
    if (options.company) {
      formData.append('company', options.company);
    }
    for (const resume of resumes) {
      formData.append('resumes', resume);
    }

    const res = await api.post<APIResponse<JobScreeningResult>>('/jobs/quick-match', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
};

