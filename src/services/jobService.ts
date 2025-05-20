import api from '../api/apiConfig';
import type { CreateJobType } from '../types/CreateJobType';

export const getAllJobs = async () => {
  try {
    const response = await api.get('/jobs/get-jobs');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    throw error;
  }
};

export const deleteJob = async (id: string) => {
  try {
    const response = await api.get(`/jobs/delete-job/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete jobs:', error);
    throw error;
  }
};

export const updateJob = async (id: string) => {
  try {
    const response = await api.post(`/jobs/update-job/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to update job:', error);
    throw error;
  }
};

export const createJob = async (jobDetails: CreateJobType) => {
  try {
    const response = await api.post(`/jobs/create-job/`, jobDetails);
    return response.data;
  } catch (error) {
    console.error('Failed to create job:', error);
    throw error;
  }
};