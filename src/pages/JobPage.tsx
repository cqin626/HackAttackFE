import UploadResume from "../components/JobPage/UploadResume";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../services/jobService";
import type { JobType } from "../models/Job";
import KanbanBoard from "../components/JobPage/kanban/KanbanBoard";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

const JobPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getJobById(id)
      .then((data) => setJob(data))
      .catch((err) => {
        const message = err?.message || "An unexpected error occurred";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <Spinner message="Loading Job..." />
        </div>
      </>
    );
  }

  if (job === null) {
    return (
      <div className="bg-light min-vh-100">
        <Navbar />
        <div
          className="alert alert-danger my-4 d-flex align-items-center m-5"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error || "Job data not found or failed to load."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <div className="container py-4">
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h1 className="card-title fw-bold mb-1">{job.title}</h1>
                    <h6 className="text-muted">{job.employmentType}</h6>
                  </div>
                  <span
                    className={`badge rounded-pill fs-6 px-3 py-2 bg-${
                      job.status === "Open"
                        ? "success"
                        : job.status === "Paused"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="mb-4 pb-3 border-bottom">
                  {job.salaryRange && (
                    <div className="d-inline-block me-4">
                      <i className="bi bi-currency-dollar me-1 text-primary"></i>
                      <span>
                        {job.salaryRange.currency}{" "}
                        {job.salaryRange.min?.toLocaleString()} -{" "}
                        {job.salaryRange.max?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="d-inline-block">
                    <i className="bi bi-calendar-date me-1 text-primary"></i>
                    <span>
                      Posted:{" "}
                      {new Date(job.createdAt ?? "").toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold text-primary mb-3">Description</h5>
                  <p className="text-secondary">{job.description}</p>
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h5 className="fw-bold text-primary mb-3">Requirements</h5>
                    <ul className="list-group list-group-flush">
                      {job.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="list-group-item ps-0 border-0 d-flex align-items-center"
                        >
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Apply for this position</h5>
                <UploadResume />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
};

export default JobPage;
