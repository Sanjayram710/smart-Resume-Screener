import api from './api';
import { APIResponse } from '../types/api';
import { Candidate, CandidateDetail } from '../types/candidate';

export const candidateService = {
  async getCandidatesByJobId(jobId: number): Promise<Candidate[]> {
    const res = await api.get<APIResponse<Candidate[]>>(`/jobs/${jobId}/candidates`);
    return res.data.data;
  },

  async getCandidateById(candidateId: number): Promise<CandidateDetail> {
    const res = await api.get<APIResponse<CandidateDetail>>(`/candidates/${candidateId}`);
    return res.data.data;
  },
};
