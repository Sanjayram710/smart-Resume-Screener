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
};
