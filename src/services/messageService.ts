import axios from "../api/apiConfig";
import type { Message } from "../types/messageType";


export const syncMessages = async (): Promise<void> => {
  const response = await axios.get("/messages/sync-messages",{ withCredentials: true });
  if (response.status !== 200) {
    throw new Error("Sync failed");
  }
};

export const fetchMessages = async (): Promise<Message[]> => {
  const response = await axios.get('/messages/db-messages'); // no email param
  return response.data;
};
