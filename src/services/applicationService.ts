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

export const createApplication = async (applicationDetails: ApplicationType) => {
  try {
    const response = await api.post(`/applications/`, applicationDetails);
    return response.data;
  } catch (error) {
    console.error("Failed to create application:", error);
    throw error;
  }
};

import axios from "axios";

export async function sendVerificationRequest(candidateId: string, jobId: string) {
  console.log('Sending verification for:', candidateId, jobId);
  const res = await axios.post(
    "http://localhost:8080/verification/start",
    { candidateId, jobId },
    { withCredentials: true }
  );
  return res.data;
}
