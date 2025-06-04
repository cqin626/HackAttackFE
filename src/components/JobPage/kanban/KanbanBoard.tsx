import ColumnContainer from "./ColumnContainer";
import type { ApplicationType } from "../../../models/Application";
import {
  getApplicantsByJobId,
  sendVerificationRequest,
} from "../../../services/applicationService";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  getApplicantsByStatus,
  getJobApplicantsJSON,
} from "../../../utils/applicationUtil";
import toast from "react-hot-toast";
import Modal from "../../Modal";
import { Modal as BSModal } from "bootstrap";

const KanbanBoard = () => {
  const { id } = useParams();
  const columns = ["Applied", "Screened", "Verified", "Interview Scheduled"];
  const [candidates, setCandidates] = useState<ApplicationType[]>([]);

  const [verificationModal, setVerificationModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    isSuccess: boolean;
  }>({
    show: false,
    title: "",
    message: "",
    isSuccess: true,
  });

  useEffect(() => {
    if (id) {
      getApplicantsByJobId(id)
        .then((data) => setCandidates(data.applicants))
        .catch((err) => {
          const message = err?.message || "An unexpected error occurred";
          toast.error("Error loading applicants: " + message);
        });
    }
  }, [id]);

  const groupedCandidates = useMemo(() => {
    return candidates.reduce<Record<string, typeof candidates>>(
      (acc, candidate) => {
        const status = candidate.status.toLowerCase();
        if (!acc[status]) acc[status] = [];
        acc[status].push(candidate);
        return acc;
      },
      {}
    );
  }, [candidates]);

  const columnConfigs: Record<
    string,
    { buttonText: string; onClick: () => void; icon: string; color: string }
  > = {
    Applied: {
      buttonText: "Filter",
      onClick: () => console.log("Filtering Applied Candidates"),
      icon: "bi-funnel",
      color: "primary",
    },
      Screened: {
      buttonText: "Verify",
      onClick: async () => {
        const applicants = getApplicantsByStatus(candidates, "screened");

        if (applicants.length === 0) {
          // Show modal with no verification message
          setVerificationModal({
            show: true,
            title: "No Verification Sent",
            message: "No candidates to verify.",
            isSuccess: false,
          });

          const modalElement = document.getElementById("verificationResultModal");
          if (modalElement) {
            const modal = new BSModal(modalElement);
            modal.show();
          }
          return; // exit early
        }

        const json = getJobApplicantsJSON(applicants, id ?? "");

        try {
          const verificationResult = await sendVerificationRequest(json);

          setVerificationModal({
            show: true,
            title: "Verification Sent",
            message: verificationResult.message ?? "Verification successful!",
            isSuccess: true,
          });

          const modalElement = document.getElementById("verificationResultModal");
          if (modalElement) {
            const modal = new BSModal(modalElement);
            modal.show();
          }
        } catch (error) {
          setVerificationModal({
            show: true,
            title: "Verification Failed",
            message: error instanceof Error ? error.message : String(error),
            isSuccess: false,
          });

          const modalElement = document.getElementById("verificationResultModal");
          if (modalElement) {
            const modal = new BSModal(modalElement);
            modal.show();
          }
        }
      },
      icon: "bi-check-circle",
      color: "info",
    },

    Verified: {
      buttonText: "Schedule Interview",
      onClick: () => console.log("Verifying Candidate Info"),
      icon: "bi-calendar-event",
      color: "success",
    },
    "Interview Scheduled": {
      buttonText: "Mark Interviewed",
      onClick: () => console.log("Rescheduling Interview"),
      icon: "bi-check2-all",
      color: "warning",
    },
  };

  return (
    <>
      <div className="my-5 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary mb-0">
            <i className="bi bi-kanban me-2"></i>
            Application Progress
          </h4>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#filterConfigurationModal"
          >
            <i className="bi bi-funnel me-1"></i>
            Filter By
          </button>
        </div>

        <div className="kanban-board">
          <div className="row g-3">
            {columns.map((col) => {
              const config = columnConfigs[col];
              if (!config) return null;

              const { buttonText, onClick, icon, color } = config;
              const applications = groupedCandidates[col.toLowerCase()] || [];

              return (
                <div className="col-md-6 col-lg-3" key={col}>
                  <ColumnContainer
                    column={col}
                    buttonText={buttonText}
                    onButtonClick={onClick}
                    applications={applications}
                    icon={icon}
                    color={color}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        id="filterConfigurationModal"
        title="Filter Configuration"
        btnText="Save"
        onConfirm={() => {
          console.log("Test");
        }}
      >
        <p className="mb-0">Test</p>
      </Modal>

      <Modal
        id="verificationResultModal"
        title={verificationModal.title}
        btnText="Close"
        onConfirm={() =>
          setVerificationModal((prev) => ({ ...prev, show: false }))
        }
      >
        <p
          className={`mb-0 ${
            verificationModal.isSuccess ? "text-success" : "text-danger"
          }`}
        >
          {verificationModal.message}
        </p>

        <style>{`
          #verificationResultModal .modal-footer > .btn.btn-light {
            display: none;
          }
        `}</style>
      </Modal>

    </>
  );
};

export default KanbanBoard;
