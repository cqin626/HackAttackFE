interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  btnText?: string;
  showFooter?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  id,
  title,
  children,
  btnText = "Save",
  onConfirm,
  showFooter = true,
}) => {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">

          {/* header */}
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

          {/* content */}
          <div className="modal-body p-4">{children}</div>

          {/* footer */}
          {showFooter && (
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
