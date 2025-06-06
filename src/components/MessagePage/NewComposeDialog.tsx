import React, { useState } from "react";

interface NewComposeDialogProps {
  onClose: () => void;
  onSend: (data: {
    to: string;
    subject: string;
    body: string;
    attachments: File[];
  }) => void;
}

const NewComposeDialog: React.FC<NewComposeDialogProps> = ({
  onClose,
  onSend,
}) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (!to.trim()) {
      alert("Please enter a recipient email.");
      return;
    }
    onSend({ to, subject, body, attachments });
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
          <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title">Compose New Email</h5>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => {
                  setTo("");
                  setSubject("");
                  setBody("");
                  setAttachments([]);
                  onClose();
                }}
                style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

          <div className="modal-body">
            <input
              type="email"
              placeholder="Recipient Email(s), comma separated"
              className="form-control mb-3"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              multiple={false} // Keep this false because this is a text input for emails, not a file input
            />

            <input
              type="text"
              placeholder="Subject"
              className="form-control mb-3"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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
                setTo("");
                setSubject("");
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

export default NewComposeDialog;
