import { apiFetch } from "@/lib/api";

export const jobService = {
  // Add ?random=true to the endpoints
  getColdStartJobs() {
    return apiFetch("/recommendations/cold-start/jobs?limit=20&random=true");
  },

  getRecommendedJobs(studentId: string) {
    return apiFetch(`/recommendations/jobs/${studentId}?limit=20&random=true`);
  },

  getJobById(id: string) {
    return apiFetch(`/get-job/${id}`);
  }
};