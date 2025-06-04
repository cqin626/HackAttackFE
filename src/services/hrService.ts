import api from "../api/apiConfig";

export const getHrEmail = async () => {
  try {
    const response = await api.get("/hr/get-email");
    return response.data;
  } catch (error) {
    console.error("Failed to get HR email" + error);
    throw error;
  }
};