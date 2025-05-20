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

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobToDelete, setJobToDelete] = useState<JobType | null>(null);
  const [jobToEdit, setJobToEdit] = useState<JobType | null>(null);
  const [newJobData, setNewJobData] = useState<CreateJobType>();
  const [shouldReloadJobs, setShouldReloadJobs] = useState(0);

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

  if (loading) {
    return (
      <Spinner message="Loading Jobs..."></Spinner>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        {error}
      </div>
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
    console.log(job);
  }

  // Edit
  const handleEditRequest = async (job: JobType) => {
    // toast.success("Edited " + job._id);
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

      <div className="container my-3">
        <h1 className="mb-4">Jobs</h1>

        {/* Create */}
        <Button text="Add Job" onClick={handleAddJobClick} />
        <Modal id="addJobModal" title="Add Job" onConfirm={handleSave}>
          <JobForm setNewJobData={setNewJobData} setShouldReloadJobs={setShouldReloadJobs}></JobForm>
        </Modal>

        {/* Display */}
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Employment Type</th>
                    <th>Status</th>
                    <th>Salary Range</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <Job
                      key={job._id}
                      job={job}
                      onEdit={() => handleEditRequest(job)}
                      onDelete={() => handleDeleteRequest(job)}
                      onClick={() => viewJobDetails(job)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        {/* Update */}
        <Modal id="editJobModal" title="Edit Job" onConfirm={handleSave}>
          <JobForm setNewJobData={setNewJobData} setShouldReloadJobs={setShouldReloadJobs} jobToEdit={jobToEdit}></JobForm>
        </Modal>

        {/* Delete */}
        <Modal
          id="deleteJobModal"
          title="Confirm Deletion"
          onConfirm={confirmDelete}
          btnText="Delete"
        >
          Are you sure you want to delete{" "}
          <strong>{jobToDelete?.title}</strong>?
        </Modal>
      </div>
    </>
  );
};

export default Home;