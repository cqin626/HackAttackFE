
import axios from "../api/apiConfig";

export interface CalendarEvent {
  summary: string;
  description: string;
  start: string;  // ISO format
  end: string;    // ISO format
  email: string[];  // Attendee emails
}

export const createEvent = async (event: CalendarEvent): Promise<void> => {
  await axios.post("/calendar/createEvent", event, { withCredentials: true });
};

export async function getEvents(userEmail: string) {
  const res = await axios.get(`/calendar/getEvent`, {
    params: { email: userEmail },
    withCredentials: true,
  });
  return res.data;
}