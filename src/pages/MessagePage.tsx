// MessagePage.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NewComposeDialog from "../components/MessagePage/NewComposeDialog";
import MessageViewer from "../components/MessagePage/MessageViewer";
import type { Message } from "../types/messageType";

import {
  fetchMessages,
  syncMessages,
  syncSentMessages,  // Import syncSentMessages
  deleteMessage,
  sendEmailViaGmail,
  replyToEmailViaGmail,
} from "../services/messageService";

const MessagePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNewCompose, setShowNewCompose] = useState(false);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  useEffect(() => {
    const syncAndFetch = async () => {
      try {
        // Sync inbox and sent messages concurrently
        await Promise.all([syncMessages(), syncSentMessages()]);

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

  const groupedBySender = messages.reduce((acc, msg) => {
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
    // Convert comma-separated string to string[]
    const recipientArray = email.to.split(",").map(addr => addr.trim());

    await sendEmailViaGmail({
      to: recipientArray,
      subject: email.subject,
      body: email.body,
      attachments: email.attachments,
    });

    alert("Email sent!");
    setShowNewCompose(false);
    const data = await fetchMessages();
    setMessages(data);
  } catch (err) {
    console.error("Error sending email:", err);
    alert("Failed to send email.");
  }
};

  const handleReplyEmail = async (email: {
    to: string;
    subject: string;
    body: string;
    attachments: File[];
    threadId: string;
    messageId: string;
  }) => {
    try {
      const payload = {
        to: email.to,
        subject: email.subject,
        bodyText: email.body,
        threadId: email.threadId,
        originalMessageId: email.messageId,
        replyToMessageId: email.messageId,
        attachments: email.attachments,
      };

      await replyToEmailViaGmail(payload);
      alert("Reply sent!");
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply.");
    }
  };

  const handleDeleteMessage = async (threadId: string) => {
    try {
      await deleteMessage(threadId, true);
      setMessages((prev) => prev.filter((msg) => msg.threadId !== threadId));
      alert("Conversation deleted successfully.");
    } catch (err) {
      console.error("Error deleting message thread:", err);
      alert("Failed to delete conversation.");
    }
  };

  const selectedMessages = selectedSender
    ? groupedBySender[selectedSender] || []
    : [];

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h4">Inbox</h1>
          <button className="btn btn-success" onClick={() => setShowNewCompose(true)}>
            Compose
          </button>
        </div>

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
              {Object.keys(groupedBySender)
                .sort()
                .map((sender) => {
                  const match = sender.match(/^(.*)\s<(.+)>$/); // Extract name and email
                  const name = match?.[1] ?? sender;
                  const email = match?.[2] ?? "";

                  return (
                    <div
                      key={sender}
                      className={`p-2 rounded mb-2 ${
                        selectedSender === sender ? "bg-primary text-white" : "bg-light"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedSender(sender);
                        setSelectedThreadId(null);
                      }}
                    >
                      <div className="fw-semibold">{name}</div>
                      <div className="text-muted" style={{ fontSize: "0.9em" }}>{email}</div>
                    </div>
                  );
                })}
            </div>

            {/* Right Panel: Delegate to MessageViewer */}
            <div
              className="p-3 flex-grow-1"
              style={{ height: "75vh", display: "flex", flexDirection: "column" }}
            >
             {selectedSender ? (
                <MessageViewer
                  messages={messages}
                  selectedSender={selectedSender}
                  selectedThreadId={selectedThreadId}
                  onThreadSelect={setSelectedThreadId}
                  onBackToThreads={() => setSelectedThreadId(null)}
                  onReply={handleReplyEmail}
                  onDelete={handleDeleteMessage}
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                  <p>Please select a candidate on the left to view messages.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showNewCompose && (
        <NewComposeDialog
          onClose={() => setShowNewCompose(false)}
          onSend={handleSendEmail}
        />
      )}
    </>
  );
};

export default MessagePage;
