import React from "react";
import type { Message } from "../../types/messageType";

interface Props {
  messages: Message[];
}

const Messages: React.FC<Props> = ({ messages }) => {
  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index} className="border p-3 rounded shadow mb-4">
          <p>
            <strong>Content:</strong>{" "}
            {msg.body.split(/On .* wrote:/)[0].trim()}
          </p>
          <p>
            <strong>Received At:</strong>{" "}
            {new Date(msg.receivedAt).toLocaleString()}
          </p>
          {msg.attachments.length > 0 && (
  <div>
    <p>
      <strong>Attachments:</strong>
      {msg.attachments.length === 1 ? (
        <span style={{ marginLeft: "0.5rem" }}>
          <a
            href={`http://localhost:8080/messages/download-attachment?messageId=${encodeURIComponent(
              msg.messageId
            )}&attachmentId=${encodeURIComponent(
              msg.attachments[0].attachmentId
            )}&filename=${encodeURIComponent(msg.attachments[0].filename)}`}
            download={msg.attachments[0].filename}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-decoration-underline"
          >
            {msg.attachments[0].filename} ({msg.attachments[0].mimeType})
                    </a>
                  </span>
                ) : (
                  <ul className="list-unstyled ms-3 mt-1">
                    {msg.attachments.map((att, i) => (
                      <li key={i}>
                        <a
                          href={`http://localhost:8080/messages/download-attachment?messageId=${encodeURIComponent(
                            msg.messageId
                          )}&attachmentId=${encodeURIComponent(
                            att.attachmentId
                          )}&filename=${encodeURIComponent(att.filename)}`}
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
                )}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Messages;
