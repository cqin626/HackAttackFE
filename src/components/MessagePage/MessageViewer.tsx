import React, { useState } from "react";
import type { Message } from "../../types/messageType";
import Messages from "./Messages";

interface MessageViewerProps {
  messages: Message[];
  selectedSender: string | null;
  selectedThreadId: string | null;
  onThreadSelect: (threadId: string | null) => void;
  onBackToThreads: () => void;
  onReply: (email: {
    to: string;
    subject: string;
    body: string;
    attachments: File[];
    threadId: string;
    messageId: string;
  }) => void;
  onDelete: (id: string) => void;
}

const MessageViewer: React.FC<MessageViewerProps> = ({
  messages,
  selectedSender,
  selectedThreadId,
  onThreadSelect,
  onBackToThreads,
  onReply,
  onDelete,
}) => {
  const [replyBody, setReplyBody] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);

  if (!selectedSender) return <p>Select a sender to view messages.</p>;

  // Filter messages by sender
  const selectedMessages = messages.filter((msg) => msg.from === selectedSender);

  // Group messages by threadId
  const groupedByThread = selectedMessages.reduce((acc, msg) => {
    if (!acc[msg.threadId]) acc[msg.threadId] = [];
    acc[msg.threadId].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  if (selectedThreadId) {
    // Sort selected thread messages by date ascending (oldest first)
    const threadMessages =
      groupedByThread[selectedThreadId]?.sort(
        (a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
      ) || [];

    const latestMessage = threadMessages[threadMessages.length - 1];

    const handleSendReply = () => {
      if (!replyBody.trim()) {
        alert("Reply body cannot be empty");
        return;
      }
      onReply({
        to: latestMessage.from,
        subject: latestMessage.subject || "(No Subject)",
        body: replyBody,
        attachments: replyAttachments,
        threadId: selectedThreadId,
        messageId: latestMessage.messageId,
      });
      setReplyBody("");
      setReplyAttachments([]);
    };

    const handleDeleteThread = () => {
      if (confirm("Are you sure you want to delete this entire thread?")) {
        onDelete(selectedThreadId);
        onBackToThreads();
      }
    };

    return (
      <div className="d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-shrink-0">
          <h5 className="mb-0">{threadMessages[0]?.subject || "(No Subject)"}</h5>
          <div>
            <button
              className="btn btn-sm btn-outline-danger me-2"
              onClick={handleDeleteThread}
            >
              Delete Thread
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onBackToThreads}
            >
              Back
            </button>
          </div>
        </div>

        <div
          className="flex-grow-1 overflow-auto mb-3"
          style={{ maxHeight: "calc(100% - 150px)" }}
        >
          <Messages messages={threadMessages} />
        </div>

        <div
          className="border-top pt-3 flex-shrink-0 d-flex flex-column"
          style={{ maxHeight: "150px", boxSizing: "border-box", padding: "0 1rem" }}
        >
          <textarea
            className="form-control mb-2 flex-grow-1"
            rows={3}
            placeholder="Write your reply..."
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            style={{ resize: "none" }}
          />
          <input
            type="file"
            multiple
            onChange={(e) =>
              setReplyAttachments(e.target.files ? Array.from(e.target.files) : [])
            }
            className="form-control mb-2"
          />
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleSendReply}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sort threads by latest message date descending
  const sortedThreads = Object.entries(groupedByThread).sort(([, msgsA], [, msgsB]) => {
    const latestA = msgsA.reduce((prev, curr) =>
      new Date(curr.receivedAt) > new Date(prev.receivedAt) ? curr : prev
    );
    const latestB = msgsB.reduce((prev, curr) =>
      new Date(curr.receivedAt) > new Date(prev.receivedAt) ? curr : prev
    );
    return new Date(latestB.receivedAt).getTime() - new Date(latestA.receivedAt).getTime();
  });

  return (
    <div className="d-flex flex-column h-100">
      <h5 className="mb-3 flex-shrink-0">Messages</h5>
      <div className="overflow-auto flex-grow-1">
        {sortedThreads.map(([threadId, msgs]) => {
          const latestMsg = msgs.reduce((prev, curr) =>
            new Date(curr.receivedAt) > new Date(prev.receivedAt) ? curr : prev
          );

          return (
            <div
              key={threadId}
              className={`border rounded p-3 mb-2 ${
                selectedThreadId === threadId ? "bg-primary text-white" : "bg-light"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => onThreadSelect(threadId)}
            >
              <strong>{latestMsg.subject || "(No Subject)"}</strong>
              <p className="mb-0 text-muted small">
                {msgs.length} message(s) — Last received:{" "}
                {new Date(latestMsg.receivedAt).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageViewer;
