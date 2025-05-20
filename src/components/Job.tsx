import React from "react";
import type { JobType } from "../models/Job";
import Button from "./Button";

interface JobProps {
  job: JobType;
  onEdit: (id: string) => void;
  onDelete: (job: JobType) => void;
  onClick?: (job: JobType) => void;
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

  const handleRowClick = () => {
    if (onClick) onClick(job);
  };

  return (
    <tr onClick={handleRowClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <td>{job.title}</td>
      <td>{job.employmentType}</td>
      <td>{job.status}</td>
      <td>{job.salaryRange.min} - {job.salaryRange.max} {job.salaryRange.currency}</td>
      <td>{formatDate(job.createdAt)}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <div className="d-flex gap-2">
          <Button text="Edit" onClick={() => onEdit(job._id)} />
          <Button text="Delete" type="danger" onClick={() => onDelete(job)} />
        </div>
      </td>
    </tr>
  );
};

export default Job;
