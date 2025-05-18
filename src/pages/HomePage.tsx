import React, { useEffect, useState } from "react";
import { getAllJobs } from "../services/jobService";
import type { Job } from "../models/Job";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status"></div>
        <div>Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar></Navbar>
      <div className="container my-3">
        <h1 className="mb-4">Jobs</h1>
        <div className="row">
          {jobs.map((job) => (
            <div key={job._id} className="col-12 col-md-6 col-lg-4 mb-4">
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
                    <strong>Salary:</strong> {job.salaryRange.min} -{" "}
                    {job.salaryRange.max} {job.salaryRange.currency}
                  </p>
                </div>
                <div className="card-footer text-muted">
                  Posted on: {formatDate(job.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
