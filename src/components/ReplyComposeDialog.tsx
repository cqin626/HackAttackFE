import React, { useState } from "react";

interface ComposeDialogProps {
  receiverEmail: string;
  subject: string;
  threadId: string;
  messageId: string;
  onClose: () => void;
  onSend: (data: {
    to: string;
    subject: string;
    body: string;
    attachments: File[];
    threadId: string;
    messageId: string;
  }) => void;
}

const ComposeDialog: React.FC<ComposeDialogProps> = ({
  receiverEmail,
  subject: initialSubject,
  threadId,
  messageId,
  onClose,
  onSend,
}) => {
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    onSend({ 
      to: receiverEmail,
      subject: initialSubject,
      body,
      attachments,
      threadId,
      messageId,
    });
    onClose();
  };

  return (
    <div
      className="modal show"
      tabIndex={-1}
      role="dialog"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reply to {receiverEmail}</h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => {
                setBody("");
                setAttachments([]);
                onClose();
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              value={initialSubject}
              readOnly
            />
            <textarea
              placeholder="Message"
              className="form-control mb-3"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <input
              type="file"
              multiple
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setBody("");
                setAttachments([]);
                onClose();
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeDialog;
