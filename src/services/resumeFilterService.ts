import api from "../api/apiConfig";
import type {
  ResumeFilter,
  ResumeFilterCondition,
} from "../models/ResumeFilter";

export const getResumeFilterByJobId = async (jobId: string) => {
  try {
    const response = await api.get(`/resume-filters/get-filters/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch resume filter by ID:", error);
    throw error;
  }
};

export const upsertResumeFilter = async (resumeFilter: ResumeFilter) => {
  try {
    const response = await api.post(
      `/resume-filters/upsert-filter`,
      resumeFilter
    );
    return response.data;
  } catch (error) {
    console.error("Failed to upsert resume filter", error);
    throw error;
  }
};

export const refineResumeFilter = async (
  conditions: ResumeFilterCondition[]
) => {
  try {
    const response = await api.post(
      `/resume-filters/refine-filter`,
      {conditions}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to refine resume filter", error);
    throw error;
  }
};
