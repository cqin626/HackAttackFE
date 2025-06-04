import ColumnContainer from "./ColumnContainer";
import type { ApplicationType } from "../../../models/Application";
import { getApplicantsByJobId } from "../../../services/applicationService";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import toast from "react-hot-toast";
import Modal from "../../Modal";
import ScheduleForm from "../ScheduleForm";
import type { JobType } from "../../../models/Job";

type KanbanBoardProps = {
  job: JobType
};

const KanbanBoard = ({ job }: KanbanBoardProps) => {
  const { id } = useParams();
  const columns = ["Applied", "Screened", "Verified", "Interview Scheduled"];
  const [candidates, setCandidates] = useState<ApplicationType[]>([]);
  const [verifiedCandidateEmails, setVerifiedCandidateEmails] = useState<string[]>([]);

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

  const getCandidateEmailsByStatus = useCallback((status: string): string[] => {
    const candidates = groupedCandidates[status.toLowerCase()] || [];
    return candidates
      .map((candidate) => candidate.applicant?.email)
      .filter((email): email is string => Boolean(email));
  }, [groupedCandidates]);

  useEffect(() => {
    const verifiedEmails = getCandidateEmailsByStatus("verified");
    setVerifiedCandidateEmails(verifiedEmails);
  }, [groupedCandidates, getCandidateEmailsByStatus]);


  const columnConfigs: Record<
    string,
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
      onClick: () => console.log("Filtering Applied Candidates"),
      icon: "bi-funnel",
      color: "primary",
    },
    Screened: {
      buttonText: "Verify",
      onClick: () => console.log("Viewing Screened Candidates"),
      icon: "bi-check-circle",
      color: "info",
    },
    Verified: {
      buttonText: "Schedule Interview",
      onClick: () => {
      },
      icon: "bi-calendar-event",
      color: "success",
      modalTarget: "#scheduleInterviewBtn"
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
        onConfirm={() => {
          console.log("Test");
        }}
      >
        {/* Modal content goes here */}
        <p className="mb-0">Test</p>
      </Modal>
      <Modal
        id="scheduleInterviewBtn"
        title="Schedule Group Interview"
        btnText="Create Event"
        onConfirm={() => {
          alert("schedule");
        }}
      >
        {/* Modal content goes here */}
        <ScheduleForm job={job} verifiedCandidateEmails={verifiedCandidateEmails}></ScheduleForm>
      </Modal>
    </>
  );
};

export default KanbanBoard;
