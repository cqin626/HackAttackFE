import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Modal from "../components/Modal";
import JobForm from "../components/JobForm";
import Job from "../components/Job";
import { Modal as BootstrapModal } from "bootstrap";
import type { CreateJobType } from '../types/CreateJobType';
import { deleteJob, getAllJobs, updateJob } from "../services/jobService";
import toast from "react-hot-toast";
import type { JobType } from "../models/Job";
import Spinner from "../components/Spinner";
import type { AxiosError } from "axios";
import { useNavigate,useLocation } from "react-router-dom";


const Home: React.FC = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobToDelete, setJobToDelete] = useState<JobType | null>(null);
  const [jobToEdit, setJobToEdit] = useState<JobType | null>(null);
  const [newJobData, setNewJobData] = useState<CreateJobType>();
  const [shouldReloadJobs, setShouldReloadJobs] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();
  const location = useLocation();

   useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored:", token);
      navigate("/home", { replace: true }); 
      return;
    }
  }, []);

  type ErrorResponse = {
    message: string;
  };

  // show error toast if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data.jobs);
      } catch {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [shouldReloadJobs]);

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <Spinner message="Loading Jobs..." />
        </div>
      </>
    );
  }

  // Create
  const handleAddJobClick = () => {
    const modalElement = document.getElementById("addJobModal");
    if (modalElement) {
      const modal = new BootstrapModal(modalElement);
      modal.show();
    }
  };

  const handleSave = () => {
    const form = document.getElementById("jobForm") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  // Read
  const viewJobDetails = (job: JobType) => {
    navigate(`/job/${job._id}`);
  };

  // Edit
  const handleEditRequest = async (job: JobType) => {
    setJobToEdit(job);

    const modalElement = document.getElementById("editJobModal");
    if (modalElement) {
      const modal = new BootstrapModal(modalElement);
      modal.show();
    }
  };

  // Delete
  const confirmDelete = async () => {
    if (!jobToDelete) return;

    const modalEl = document.getElementById("deleteJobModal");
    let modal: BootstrapModal | null = null;

    if (modalEl) {
      modal = BootstrapModal.getInstance(modalEl);
      modal?.hide();
    }

    try {
      setLoading(true);
      await deleteJob(jobToDelete._id);
      toast.success(`Deleted job "${jobToDelete.title}" successfully.`);
      setShouldReloadJobs((prev) => prev + 1);

    } catch (e: unknown) {
      const error = e as AxiosError<ErrorResponse>;
      const message = error.response?.data?.message || "Failed to delete job (unknown error)";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setJobToDelete(null);
    }
  };

  const handleDeleteRequest = (job: JobType) => {
    setJobToDelete(job);

    // show confirmation modal
    const modalEl = document.getElementById("deleteJobModal");
    if (modalEl) {
      const modal = new BootstrapModal(modalEl);
      modal.show();
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid py-4 px-4 bg-light min-vh-100">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="section-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
              <h2 className="card-title mb-3 mb-md-0">
                <i className="bi bi-briefcase me-2 text-primary"></i>
                Job Listings
              </h2>
              <div className="d-flex flex-column flex-md-row gap-2">
                <Button
                  text="Add New Job"
                  icon="plus-lg"
                  onClick={handleAddJobClick}
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12 col-md-8 mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search jobs by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-4">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Salary Range</th>
                    <th>Posted Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {error ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="alert alert-danger my-4 d-flex align-items-center" role="alert">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          {error}
                        </div>
                      </td>
                    </tr>
                  ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <Job
                        key={job._id}
                        job={job}
                        onEdit={() => handleEditRequest(job)}
                        onDelete={() => handleDeleteRequest(job)}
                        onClick={() => viewJobDetails(job)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        <div className="d-flex flex-column align-items-center py-4">
                          <i className="bi bi-search text-secondary mb-2" style={{ fontSize: "1.5rem" }}></i>
                          <p className="mb-1 text-secondary">No jobs found</p>
                          <p className="small text-muted mb-0">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create Modal */}
        <Modal id="addJobModal" title="Add New Job" onConfirm={handleSave}>
          <JobForm setNewJobData={setNewJobData} setShouldReloadJobs={setShouldReloadJobs} />
        </Modal>

        {/* Update Modal */}
        <Modal id="editJobModal" title="Edit Job" onConfirm={handleSave}>
          <JobForm setNewJobData={setNewJobData} setShouldReloadJobs={setShouldReloadJobs} jobToEdit={jobToEdit} />
        </Modal>

        {/* Delete Modal */}
        <Modal
          id="deleteJobModal"
          title="Confirm Deletion"
          onConfirm={confirmDelete}
          btnText="Delete"
        >
          <div className="text-center p-4">
            <div className="mb-4">
              <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
            </div>
            <h4 className="mb-3">Delete Job</h4>
            <p className="mb-0">
              Are you sure you want to delete{" "}
              <strong className="text-danger">{jobToDelete?.title}</strong>?
            </p>
            <p className="text-muted small mt-2">This action cannot be undone.</p>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Home;