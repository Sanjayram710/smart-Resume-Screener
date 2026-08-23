import api from './api';
import { APIResponse } from '../types/api';
import { Job, JobCreatePayload, JobSummary, ParsedJDResponse } from '../types/job';

export const jobService = {
  async getJobs(): Promise<JobSummary[]> {
    const res = await api.get<APIResponse<JobSummary[]>>('/jobs');
    return res.data.data;
  },

  async getJobById(id: number): Promise<Job> {
    const res = await api.get<APIResponse<Job>>(`/jobs/${id}`);
    return res.data.data;
  },

  async createJob(payload: JobCreatePayload): Promise<Job> {
    const res = await api.post<APIResponse<Job>>('/jobs', payload);
    return res.data.data;
  },

  async parseJDFile(file: File, overrides?: { title?: string; company?: string }): Promise<ParsedJDResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (overrides?.title) formData.append('title_override', overrides.title);
    if (overrides?.company) formData.append('company_override', overrides.company);

    const res = await api.post<APIResponse<ParsedJDResponse>>('/jobs/parse-jd', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  async uploadJDFile(file: File, overrides?: { title?: string; company?: string }): Promise<Job> {
    const formData = new FormData();
    formData.append('file', file);
    if (overrides?.title) formData.append('title', overrides.title);
    if (overrides?.company) formData.append('company', overrides.company);

    const res = await api.post<APIResponse<Job>>('/jobs/upload-jd', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  async updateJob(id: number, payload: Partial<Job>): Promise<Job> {
    const res = await api.put<APIResponse<Job>>(`/jobs/${id}`, payload);
    return res.data.data;
  },

  async deleteJob(id: number): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};

