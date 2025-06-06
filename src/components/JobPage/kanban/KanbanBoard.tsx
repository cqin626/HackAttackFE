import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Modal as BSModal } from "bootstrap";

import ColumnContainer from "./ColumnContainer";
import Modal from "../../Modal";
import FilterConfigurationForm from "../FilterConfigurationForm";
import ScheduleForm from "../ScheduleForm";

import type { JobType } from "../../../models/Job";
import type { ApplicationType } from "../../../models/Application";
import type { ResumeFilterCondition } from "../../../models/ResumeFilter";
import type { AxiosError } from "axios";

import {
  getApplicantsByJobId,
  sendVerificationRequest,
} from "../../../services/applicationService";
import {
  upsertResumeFilter,
  getResumeFilterByJobId,
} from "../../../services/resumeFilterService";
import {
  getApplicantsByStatus,
  getJobApplicantsJSON,
} from "../../../utils/applicationUtil";

type KanbanBoardProps = {
  job: JobType;
};

const KanbanBoard = ({ job }: KanbanBoardProps) => {
  const { id } = useParams();
  const [candidates, setCandidates] = useState<ApplicationType[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [conditions, setConditions] = useState<ResumeFilterCondition[]>([]);

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

  const [verifiedCandidateEmails, setVerifiedCandidateEmails] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const applicantData = await getApplicantsByJobId(id);
        setCandidates(applicantData.applicants);
      } catch (err) {
        toast.error(
          "Error loading applicants: " + ((err as Error)?.message || "")
        );
      }

      try {
        const filterData = await getResumeFilterByJobId(id);
        const loaded =
          filterData?.data?.conditions?.length > 0
            ? filterData.data.conditions
            : [{ field: "", requirement: "", interpretedByLLM: "" }];
        setConditions(loaded);
      } catch (error) {
        const err = error as AxiosError;
        setConditions([{ field: "", requirement: "", interpretedByLLM: "" }]);
        if (err.response?.status === 404) {
          toast("Resume filter not found.");
        } else {
          toast.error("Failed to load filters.");
        }
      }
    };

    loadData();
  }, [id]);

  const groupedCandidates = useMemo(() => {
    return candidates.reduce<Record<string, ApplicationType[]>>(
      (acc, candidate) => {
        const status = candidate.status.toLowerCase();
        if (!acc[status]) acc[status] = [];
        acc[status].push(candidate);
        return acc;
      },
      {}
    );
  }, [candidates]);

  const getCandidateEmailsByStatus = useCallback(
    (status: string): string[] => {
      const candidates = groupedCandidates[status.toLowerCase()] || [];
      return candidates
        .map((candidate) => candidate.applicant?.email)
        .filter((email): email is string => Boolean(email));
    },
    [groupedCandidates]
  );

  useEffect(() => {
    const verifiedEmails = getCandidateEmailsByStatus("verified");
    setVerifiedCandidateEmails(verifiedEmails);
  }, [groupedCandidates, getCandidateEmailsByStatus]);

  const columns = [
    "Applied",
    "Screened",
    "Verified",
    "Interview Scheduled",
  ] as const;
  type ColumnKey = (typeof columns)[number];

  const columnConfigs: Record<
    ColumnKey,
    {
      buttonText: string;
      onClick: () => void;
      icon: string;
      color: string;
      modalTarget?: string;
    }
  > = {
    Applied: {
      buttonText: "Filter",
      onClick: () => {
        toast.success("Filter logic not yet implemented");
      },
      icon: "bi-funnel",
      color: "primary",
    },
    Screened: {
      buttonText: "Verify",
      onClick: async () => {
        const applicants = getApplicantsByStatus(candidates, "screened");

        if (applicants.length === 0) {
          setVerificationModal({
            show: true,
            title: "No Verification Sent",
            message: "No candidates to verify.",
            isSuccess: false,
          });

          const modalElement = document.getElementById(
            "verificationResultModal"
          );
          if (modalElement) {
            const modal = new BSModal(modalElement);
            modal.show();
          }
          return;
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

          const modalElement = document.getElementById(
            "verificationResultModal"
          );
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

          const modalElement = document.getElementById(
            "verificationResultModal"
          );
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
      onClick: () => {}, // Handled via modal
      icon: "bi-calendar-event",
      color: "success",
      modalTarget: "#scheduleInterviewBtn",
    },
    "Interview Scheduled": {
      buttonText: "Mark Interviewed",
      onClick: () => toast.success("Marked Interviewed"),
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

              const { buttonText, onClick, icon, color, modalTarget } = config;
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
                    modalTarget={modalTarget}
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
        onConfirm={async () => {
          if (!id) return;
          try {
            const filterToSave = { jobId: id, conditions };
            await upsertResumeFilter(filterToSave);
            toast.success("Filter saved successfully!");
          } catch (error) {
            toast.error("Failed to save filter: " + (error as Error).message);
          }
        }}
        btnText2="Evaluate"
        onConfirm2={async () => {
          setIsEvaluating(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.success("Evaluation complete");
          } finally {
            setIsEvaluating(false);
          }
        }}
        loading2={isEvaluating}
      >
        <FilterConfigurationForm
          conditions={conditions}
          setConditions={setConditions}
        />
      </Modal>

      <Modal
        id="scheduleInterviewBtn"
        title="Schedule Group Interview"
        showFooter={false}
      >
        <ScheduleForm
          job={job}
          verifiedCandidateEmails={verifiedCandidateEmails}
        />
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
