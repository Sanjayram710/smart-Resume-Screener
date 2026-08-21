import api from './api';
import { APIResponse } from '../types/api';
import { Job, JobCreatePayload, JobSummary } from '../types/job';

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

  async updateJob(id: number, payload: Partial<Job>): Promise<Job> {
    const res = await api.put<APIResponse<Job>>(`/jobs/${id}`, payload);
    return res.data.data;
  },

  async deleteJob(id: number): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};
