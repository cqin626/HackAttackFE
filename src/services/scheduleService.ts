import api from "../api/apiConfig";

export const addAvailableDates = async (userId: string, dates: { start: Date; end: Date }[]) => {
  try {
    const response = await api.post(`/schedules/add-dates/${userId}`, {dates});
    return response.data;
  } catch (error) {
    console.error("Failed to add interview dates:", error);
    throw error;
  }
};
