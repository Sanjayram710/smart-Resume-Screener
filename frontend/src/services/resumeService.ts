import api from './api';
import { APIResponse } from '../types/api';
import { Resume } from '../types/candidate';

export interface BatchUploadResult {
  total_uploaded: number;
  successful_resumes: Resume[];
  failed_resumes: Array<{ filename: string; reason: string }>;
}

export const resumeService = {
  async uploadResumes(jobId: number, files: File[]): Promise<BatchUploadResult> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const res = await api.post<APIResponse<BatchUploadResult>>(
      `/jobs/${jobId}/resumes`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data.data;
  },

  async getResumesByJobId(jobId: number): Promise<Resume[]> {
    const res = await api.get<APIResponse<Resume[]>>(`/jobs/${jobId}/resumes`);
    return res.data.data;
  },
};
