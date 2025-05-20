import React from "react";
import type { JobType } from "../models/Job";

interface JobProps {
  job: JobType;
  onEdit: (id: string) => void;
  onDelete: (job: JobType) => void;
  onClick: (job: JobType) => void;
}

const Job: React.FC<JobProps> = ({ job, onEdit, onDelete, onClick }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "badge bg-success";
      case "closed":
        return "badge bg-secondary";
      case "paused":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-info";
    }
  };

  return (
    <tr onClick={() => { onClick(job) }} style={{ cursor: "pointer" }}>

      <td className="py-3">
        <div className="fw-semibold">{job.title}</div>
      </td>
      <td className="py-3">
        <span className="badge bg-light text-dark border">{job.employmentType}</span>
      </td>
      <td className="py-3">
        <span className={getStatusBadgeClass(job.status)}>{job.status}</span>
      </td>
      <td className="py-3">
        <div className="d-flex align-items-center">
          <span className="text-secondary me-1">
            <i className="bi bi-currency-exchange"></i>
          </span>
          <span>
            {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()} {job.salaryRange.currency}
          </span>
        </div>
      </td>
      <td className="py-3 text-secondary small">
        <div className="d-flex align-items-center">
          <span className="me-1">
            <i className="bi bi-calendar-event"></i>
          </span>
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </td>
      <td className="py-3" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex gap-2 justify-content-end">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(job._id)}
          >
            <i className="bi bi-pencil-square me-1"></i>
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(job)}
          >
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Job;