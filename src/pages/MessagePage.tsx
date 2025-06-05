import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Messages from "../components/Messages";
import ComposeDialog from "../components/ReplyComposeDialog";       // For replies
import NewComposeDialog from "../components/NewComposeDialog"; // For new messages
import type { Message } from "../types/messageType";

import {
  fetchMessages,
  syncMessages,
  deleteMessage,
  sendEmailViaGmail,
  replyToEmailViaGmail,
} from "../services/messageService";

const MessagePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // For reply compose dialog
  const [replyEmail, setReplyEmail] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState<string | null>(null);
  const [replyThreadId, setReplyThreadId] = useState<string | null>(null);
  const [replyMessageId, setReplyMessageId] = useState<string | null>(null);

  // For new compose dialog
  const [showNewCompose, setShowNewCompose] = useState(false);

  // Track selected sender
  const [selectedSender, setSelectedSender] = useState<string | null>(null);

  useEffect(() => {
    const syncAndFetch = async () => {
      try {
        await syncMessages();
        const data = await fetchMessages();
        setMessages(data);

        // Group senders to find unique senders
        const grouped = data.reduce((acc, msg) => {
          if (!acc[msg.from]) acc[msg.from] = [];
          acc[msg.from].push(msg);
          return acc;
        }, {} as Record<string, Message[]>);

        const senders = Object.keys(grouped);

        // Select first sender if any
        if (senders.length > 0) {
          setSelectedSender(senders[0]);
        } else {
          setSelectedSender(null);
        }
      } catch (err) {
        console.error("Error syncing or fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    syncAndFetch();
  }, []);

  // Group messages by sender email
  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.from]) acc[msg.from] = [];
    acc[msg.from].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  // Filter messages only by selected sender, or empty array if none selected
  const filteredMessages = selectedSender && groupedMessages[selectedSender]
    ? groupedMessages[selectedSender]
    : [];

  // Sort filtered messages by receivedAt descending
  const sortedMessages = filteredMessages.sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  const handleSendEmail = async (email: {
    to: string;
    subject: string;
    body: string;
    attachments: File[];
  }) => {
    try {
      await sendEmailViaGmail(email);
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
      setReplyEmail(null);
      setReplySubject(null);
      setReplyThreadId(null);
      setReplyMessageId(null);
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.messageId !== id));
      alert("Message deleted successfully.");
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message.");
    }
  };

  const handleReplyClick = (msg: Message) => {
    setReplyEmail(msg.from);
    setReplySubject(msg.subject);
    setReplyThreadId((msg as any).threadId || "");
    setReplyMessageId(msg.messageId);
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h4">Inbox</h1>
          <button
            className="btn btn-success"
            onClick={() => setShowNewCompose(true)}
          >
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
              {Object.keys(groupedMessages).sort().map((sender) => (
                <div
                  key={sender}
                  className={`p-2 rounded mb-2 ${selectedSender === sender ? "bg-primary text-white" : "bg-light"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedSender(sender)}
                >
                  {sender}
                </div>
              ))}
            </div>

            {/* Right Panel: Messages */}
            <div className="p-3 flex-grow-1 overflow-auto">
              {sortedMessages.length > 0 ? (
                <Messages
                  messages={sortedMessages}
                  onReply={handleReplyClick}
                  onDelete={handleDeleteMessage}
                />
              ) : (
                <p className="text-muted">No messages to display.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Compose Dialog */}
      {showNewCompose && (
        <NewComposeDialog
          onClose={() => setShowNewCompose(false)}
          onSend={handleSendEmail}
        />
      )}

      {/* Reply Compose Dialog */}
      {replyEmail && replySubject && replyThreadId && replyMessageId && (
        <ComposeDialog
          receiverEmail={replyEmail}
          subject={replySubject}
          threadId={replyThreadId}
          messageId={replyMessageId}
          onClose={() => {
            setReplyEmail(null);
            setReplySubject(null);
            setReplyThreadId(null);
            setReplyMessageId(null);
          }}
          onSend={handleReplyEmail}
        />
      )}
    </>
  );
};

export default MessagePage;
