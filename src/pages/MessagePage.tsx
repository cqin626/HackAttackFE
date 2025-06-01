import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Messages from "../components/Messages";
import ComposeDialog from "../components/ComposeDialog";
import { fetchMessages, syncMessages, deleteMessage } from "../services/messageService";
import type { Message } from "../types/messageType";
import api from "../api/apiConfig";

const MessagePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyEmail, setReplyEmail] = useState<string | null>(null);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);

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

  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.from]) acc[msg.from] = [];
    acc[msg.from].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  const handleSendEmail = async (email: {
    to: string;
    subject: string;
    body: string;
    attachments: File[];
  }) => {
    try {
      const formData = new FormData();
      formData.append("receiverEmail", email.to);
      formData.append("subject", email.subject);
      formData.append("content", email.body);
      email.attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await api.post("/messages/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Email sent!");
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(msg => msg.messageId !== id));
      alert("Message deleted successfully.");
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <h1 className="h4 mb-4">Inbox</h1>
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="d-flex border rounded shadow-sm" style={{ height: "75vh" }}>
            {/* Left Panel: Sender List */}
            <div className="border-end p-3" style={{ width: "30%", overflowY: "auto" }}>
              {Object.keys(groupedMessages).sort().map(sender => (
                <div
                  key={sender}
                  onClick={() => setSelectedSender(sender)}
                  className={`p-2 rounded mb-2 ${selectedSender === sender ? "bg-primary text-white" : "bg-light"}`}
                  style={{ cursor: "pointer" }}
                >
                  {sender}
                </div>
              ))}
            </div>

            {/* Right Panel: Messages */}
            <div className="p-3 flex-grow-1 overflow-auto">
              {selectedSender ? (
                <Messages
                  messages={groupedMessages[selectedSender].sort(
                    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
                  )}
                  onReply={setReplyEmail}
                  onDelete={handleDeleteMessage}
                />
              ) : (
                <p className="text-muted">Select a sender to view their messages.</p>
              )}
            </div>
          </div>
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
