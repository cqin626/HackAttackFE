import ColumnContainer from "./ColumnContainer";
import type { ApplicationType } from "../../../models/Application";
import { getApplicantsByJobId } from "../../../services/applicationService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import toast from "react-hot-toast";

const KanbanBoard = () => {
  const { id } = useParams();
  const columns = ["Applied", "Screened", "Verified", "Interview Scheduled"];
  const [candidates, setCandidates] = useState<ApplicationType[]>([]);

  useEffect(() => {
    if (id) {
      getApplicantsByJobId(id)
        .then((data) => setCandidates(data.applicants))
        .catch((err) => {
          const message = err?.message || "An unexpected error occurred";
          toast.error("Error loading applicants:" + message);
        });
    }
  }, [id]);

  if (!candidates) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading candidates ...</p>
        </div>
      </div>
    );
  } else {
    const columnConfigs: Record<
      string,
      { buttonText: string; onClick: () => void; icon: string; color: string }
    > = {
      Applied: {
        buttonText: "Filter",
        onClick: () => {
          console.log("Filtering Applied Candidates");
        },
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

    return (
      <div className="my-5 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary mb-0">
            <i className="bi bi-kanban me-2"></i>
            Application Progress
          </h4>
          <button type="button" className="btn btn-sm btn-outline-secondary">
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
    );
  }
};

export default KanbanBoard;
