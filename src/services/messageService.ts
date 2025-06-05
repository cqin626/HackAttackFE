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


/**
 * Deletes a message or all messages in a thread.
 * @param id - The threadId or messageId depending on the context.
 * @param byThreadId - If true, deletes all messages in the thread.
 */
export const deleteMessage = async (
  id: string,
  byThreadId: boolean = false
): Promise<void> => {
  console.log('Deleting message:', id, 'byThreadId:', byThreadId);
  const response = await axios.delete(`/messages/delete/${id}`, {
    params: { byThreadId },
    withCredentials: true,
  });

  if (response.status !== 200) {
    throw new Error("Failed to delete message(s)");
  }
};



// Send a brand new email
export const sendEmailViaGmail = async (email: {
  to: string;
  subject: string;
  body: string;
  attachments: File[];
}): Promise<void> => {
  const formData = new FormData();
  formData.append("receiverEmail", email.to);
  formData.append("subject", email.subject);
  formData.append("content", email.body);
  email.attachments.forEach(file => {
    formData.append("attachments", file);
  });

  const response = await axios.post("/messages/send", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  if (response.status !== 200) {
    throw new Error("Failed to send email");
  }
};

export const replyToEmailViaGmail = async (reply: {
  to: string;
  subject: string;
  bodyText: string;
  threadId: string;
  originalMessageId: string;
  replyToMessageId: string;
  attachments?: File[];
}): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("to", reply.to);
    formData.append("subject", reply.subject);
    formData.append("bodyText", reply.bodyText);
    formData.append("threadId", reply.threadId);
    formData.append("originalMessageId", reply.originalMessageId);
    formData.append("replyToMessageId", reply.replyToMessageId);

    reply.attachments?.forEach(file => {
      formData.append("attachments", file);
    });

    const response = await axios.post("/messages/reply-to", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error("Failed to send reply");
    }
  } catch (error) {
    console.error("Error in replyToEmailViaGmail:", error);
    throw error;
  }
};
