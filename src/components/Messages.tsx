import React from "react";

interface Attachment {
  filename: string;
  mimeType: string;
  attachmentId: string;
}

interface Message {
  from: string;
  subject: string;
  body: string;
  receivedAt: string;
  attachments: Attachment[];
  messageId: string;
}

interface Props {
  messages: Message[];
  onReply: (receiverEmail: string) => void;
}

const Messages: React.FC<Props> = ({ messages, onReply }) => {
  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index} className="border p-3 rounded shadow mb-4">
          <p><strong>From:</strong> {msg.from}</p>
          <p><strong>Subject:</strong> {msg.subject}</p>
          <p><strong>Received At:</strong> {new Date(msg.receivedAt).toLocaleString()}</p>
          <p><strong>Content:</strong> {msg.body}</p>

          {msg.attachments.length > 0 && (
            <div>
              <p><strong>Attachments:</strong></p>
              <ul className="list-unstyled ms-3">
                {msg.attachments.map((att, i) => (
                  <li key={i}>
                    <a
                      href={`http://localhost:8080/messages/download-attachment?messageId=${encodeURIComponent(msg.messageId)}&attachmentId=${encodeURIComponent(att.attachmentId)}&filename=${encodeURIComponent(att.filename)}`}
                      download={att.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-decoration-underline"
                    >
                      {att.filename} ({att.mimeType})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => onReply(msg.from)}
            className="btn btn-primary mt-3"
          >
            Reply
          </button>
        </div>
      ))}
    </div>
  );
};

export default Messages;
