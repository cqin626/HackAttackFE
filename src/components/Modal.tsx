interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  btnText?: string;
  showFooter?: boolean;
  onConfirm2?: () => void;
  btnText2?: string;
  loading2?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  id,
  title,
  children,
  btnText = "Save",
  onConfirm,
  showFooter = true,
  onConfirm2,
  btnText2,
  loading2 = false,
}) => {
  const ButtonSpinner = () => {
    return (
      <div
        className="spinner-border spinner-border-sm"
        role="status"
        style={{ width: "1rem", height: "1rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  };

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Header */}
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

          {/* Body */}
          <div className="modal-body p-4">{children}</div>

          {/* Footer */}
          {showFooter && (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              {onConfirm2 && btnText2 && (
                <button
                  type="button"
                  aria-label="Close"
                  className="btn d-inline-flex align-items-center justify-content-center btn-secondary"
                  onClick={onConfirm2}
                  disabled={loading2}
                  style={{ minWidth: "80px", height: "38px" }}
                >
                  {loading2 ? <ButtonSpinner /> : btnText2}
                </button>
              )}

              {onConfirm && (
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  className={`btn ${
                    btnText.toLowerCase().includes("delete")
                      ? "btn-danger"
                      : "btn-primary"
                  }`}
                  onClick={onConfirm}
                >
                  {btnText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
