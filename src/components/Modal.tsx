import React, { useEffect, useRef } from "react";
import { Modal as BootstrapModal } from "bootstrap";

interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  btnText?: string;
}

const Modal: React.FC<ModalProps> = ({ id, title, children, btnText = "Save", onConfirm }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModalRef = useRef<BootstrapModal | null>(null);

  useEffect(() => {
    if (modalRef.current) {
      bsModalRef.current = new BootstrapModal(modalRef.current);
    }
  }, []);

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4">{children}</div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-light" 
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            {onConfirm && (
              <button
                type="button"
                className={`btn ${btnText.toLowerCase().includes("delete") ? "btn-danger" : "btn-primary"}`}
                onClick={onConfirm}
              >
                {btnText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;