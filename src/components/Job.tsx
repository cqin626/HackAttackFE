import React from "react";
import type { JobType } from "../models/Job";
import Button from "./Button";

interface JobProps {
  job: JobType;
  onEdit: (id: string) => void;
  onDelete: (job: JobType) => void;
}

const Job: React.FC<JobProps> = ({ job, onEdit, onDelete }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{job.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {job.employmentType} | {job.status}
          </h6>
          <p className="card-text">{job.description}</p>
          <p className="mb-1">
            <strong>Requirements:</strong>
          </p>
          <ul className="mb-3">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
          <p className="mt-auto">
            <strong>Salary:</strong> {job.salaryRange.min} - {job.salaryRange.max}{" "}
            {job.salaryRange.currency}
          </p>
        </div>
        <div className="card-footer text-muted">
          <div>Posted on: {formatDate(job.createdAt)}</div>
          <div className="d-flex justify-content-center align-items-center">
            <Button text="Edit" onClick={() => onEdit(job._id)} />
            <Button text="Delete" type="danger" onClick={() => onDelete(job)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;
