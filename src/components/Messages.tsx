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
}

const Messages: React.FC<Props> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div key={index} className="border p-4 rounded shadow">
          <p><strong>From:</strong> {msg.from}</p>
          <p><strong>Subject:</strong> {msg.subject}</p>
          <p><strong>Received At:</strong> {new Date(msg.receivedAt).toLocaleString()}</p>
          <p><strong>Content:</strong> {msg.body}</p>
          {msg.attachments.length > 0 && (
            <div>
              <p><strong>Attachments:</strong></p>
              <ul className="list-disc ml-6">
                {msg.attachments.map((att, i) => (
                  <li key={i}>
                    <a
                      href={`http://localhost:8080/messages/download-attachment?messageId=${encodeURIComponent(msg.messageId)}&attachmentId=${encodeURIComponent(att.attachmentId)}&filename=${encodeURIComponent(att.filename)}`}
                      download={att.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {att.filename} ({att.mimeType})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Messages;
