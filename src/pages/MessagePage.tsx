import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Messages from "../components/Messages";
import ComposeDialog from "../components/ComposeDialog";
import { fetchMessages, syncMessages } from "../services/messageService";
import type { Message } from "../types/messageType";
import api from "../api/apiConfig";

const MessagePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyEmail, setReplyEmail] = useState<string | null>(null);

  useEffect(() => {
    const syncAndFetch = async () => {
      try {
        await syncMessages();
        const data = await fetchMessages();
        setMessages(data);
      } catch (err) {
        console.error("Error syncing or fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    syncAndFetch();
  }, []);

  
const handleSendEmail = async (email: {
  to: string;
  subject: string;
  body: string;
  attachments: File[];
}) => {
  try {
    const formData = new FormData();
    formData.append("receiverEmail", email.to);   // changed key here
    formData.append("subject", email.subject);
    formData.append("content", email.body);       // changed key here
    email.attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    await api.post("/messages/send", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ override just for this request
      },
    });

    alert("Email sent!");
  } catch (err) {
    console.error("Error sending email:", err);
    alert("Failed to send email.");
  }
};
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h1 className="h3 mb-4">Your Current Messages</h1>
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Messages messages={messages} onReply={setReplyEmail} />
        )}
      </div>

      {replyEmail && (
        <ComposeDialog
          receiverEmail={replyEmail}
          onClose={() => setReplyEmail(null)}
          onSend={handleSendEmail}
        />
      )}
    </>
  );
};

export default MessagePage;
