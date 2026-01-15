import { apiFetch } from '@/lib/api';

export interface Job {
  _id: string;
  title: string;
  description: string;
  experienceRequired: string;
  educationRequired: string;
  skillsRequired: string[];
  industry?: string;
  location?: string;
  salary?: string;
  type?: string;
  status: 'active' | 'closed' | 'draft';
  startup: {
    _id: string;
    companyName: string;
    logo?: string;
    industry?: string;
  };
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
}

export interface JobSummary {
  totalApplications: number;
  percentageMeetingCriteria: number;
  averageATS: number;
  medianExperience: number;
}

export const startupJobService = {
  // Get all jobs
  getAllJobs: async () => {
    return apiFetch<Job[]>('/get-all-jobs');
  },

  // Get single job by ID
  getJobById: async (id: string) => {
    return apiFetch<Job>(`/get-job/${id}`);
  },

  // Get job summary
  getJobSummary: async (jobId: string) => {
    return apiFetch<JobSummary>(`/job-summary/${jobId}`);
  },
};
