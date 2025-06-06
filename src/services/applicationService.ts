import api from "../api/apiConfig";
import type { ApplicationType } from "../models/Application";

export const getApplicantsByJobId = async (jobId: string) => {
  try {
    const response = await api.get(`/applications/get-applicants/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch applicants by job ID:", error);
    throw error;
  }
};

export const createApplication = async (
  applicationDetails: ApplicationType
) => {
  try {
    const response = await api.post(`/applications/`, applicationDetails);
    return response.data;
  } catch (error) {
    console.error("Failed to create application:", error);
    throw error;
  }
};

export async function sendVerificationRequest(payload: {
  jobID: string;
  applicants: string[];
}) {
  try {
    const response = await api.post(`/verification/start`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to send applications:", error);
    throw error;
  }
}

export const updateApplicationStatus = async (applicantId: string, jobId: string, status: string) => {
  try {
    const response = await api.put(`/applications/update-status/${applicantId}/${jobId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update application status:", error);
    throw error;
  }
};
