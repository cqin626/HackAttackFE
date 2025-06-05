import { useEffect, useState } from "react";
import { createJob, updateJob } from "../../services/jobService.ts";
import toast from "react-hot-toast";
import Spinner from "../Spinner.tsx";
import { Modal as BootstrapModal } from "bootstrap";
import type { JobType } from "../../models/Job.ts";

type JobFormProps = {
  setNewJobData: (data: JobType) => void;
  setShouldReloadJobs: React.Dispatch<React.SetStateAction<number>>;
  jobToEdit?: JobType | null;
};

const JobForm: React.FC<JobFormProps> = ({ setNewJobData, setShouldReloadJobs, jobToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    employmentType: "",
    description: "",
    requirements: "",
    minSalary: "",
    maxSalary: "",
    currency: "MYR",
    status: "Open",
  });

  // Set editing state and form data when jobToEdit changes
  useEffect(() => {
    if (jobToEdit && jobToEdit._id) {
      setIsEditing(true);
      setJobId(jobToEdit._id);
      setFormData({
        title: jobToEdit.title || "",
        employmentType: jobToEdit.employmentType || "",
        description: jobToEdit.description || "",
        requirements: jobToEdit.requirements?.join(", ") || "",
        minSalary: jobToEdit.salaryRange?.min?.toString() || "",
        maxSalary: jobToEdit.salaryRange?.max?.toString() || "",
        currency: jobToEdit.salaryRange?.currency || "MYR",
        status: jobToEdit.status || "Open",
      });
    } else {
      setIsEditing(false);
      setJobId(null);
      setFormData({
        title: "",
        employmentType: "",
        description: "",
        requirements: "",
        minSalary: "",
        maxSalary: "",
        currency: "MYR",
        status: "Open",
      });
    }
  }, [jobToEdit]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert formData into JobType object
    const jobDetails: JobType = {
      title: formData.title,
      employmentType: formData.employmentType as JobType["employmentType"],
      description: formData.description,
      requirements: formData.requirements
        .split(",")
        .map((req) => req.trim())
        .filter(Boolean),
      salaryRange: {
        min: parseFloat(formData.minSalary) || 0,
        max: parseFloat(formData.maxSalary) || 0,
        currency: formData.currency,
      },
      status: formData.status as JobType["status"],
    };

    setNewJobData(jobDetails);

    try {
      setLoading(true);
      let modalElement;

      if (isEditing && jobId) {
        await updateJob(jobId, jobDetails);
        modalElement = document.getElementById("editJobModal");
        toast.success("Job Updated");
      } else {
        await createJob(jobDetails);
        modalElement = document.getElementById("addJobModal");
        toast.success("Job Added");
      }

      setShouldReloadJobs((prev) => prev + 1);

      if (modalElement) {
        const modal = BootstrapModal.getInstance(modalElement);
        modal?.hide();
      }

      // Reset form only for creating new jobs
      if (!isEditing) {
        setFormData({
          title: "",
          employmentType: "",
          description: "",
          requirements: "",
          minSalary: "",
          maxSalary: "",
          currency: "MYR",
          status: "Open",
        });
      }
    } catch (error) {
      setError(`Failed to ${isEditing ? "update" : "add"} job: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner message={isEditing ? "Updating Job..." : "Adding Job..."} />;
  }

  return (
    <div className="job-form-container">
      <form id="jobForm" onSubmit={handleSubmit}>
        <h1>{isEditing ? "Edit Job" : "Add New Job"}</h1>

        {/* Job Title */}
        <div className="mb-4">
          <label htmlFor="title" className="form-label">
            Job Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter job title"
          />
        </div>

        {/* Employment Type */}
        <div className="mb-4">
          <label htmlFor="employmentType" className="form-label">
            Employment Type
          </label>
          <select
            className="form-select"
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="form-label">
            Job Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter job description"
          ></textarea>
        </div>

        {/* Requirements */}
        <div className="mb-4">
          <label htmlFor="requirements" className="form-label">
            Requirements (comma-separated)
          </label>
          <input
            type="text"
            className="form-control"
            id="requirements"
            name="requirements"
            placeholder="e.g. JavaScript, Node.js, MongoDB"
            value={formData.requirements}
            onChange={handleChange}
          />
        </div>

        {/* Salary Range */}
        <div className="card p-3 mb-4 bg-light border-0">
          <h6 className="mb-3">Salary Information</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="minSalary" className="form-label">
                Minimum Salary
              </label>
              <input
                type="number"
                className="form-control"
                id="minSalary"
                name="minSalary"
                min="0"
                value={formData.minSalary}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="maxSalary" className="form-label">
                Maximum Salary
              </label>
              <input
                type="number"
                className="form-control"
                id="maxSalary"
                name="maxSalary"
                min="0"
                value={formData.maxSalary}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>
              <select
                className="form-select"
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="MYR">MYR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="form-label">
            Job Status
          </label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Paused">Paused</option>
          </select>
        </div>
        <button type="submit" hidden></button>
      </form>
    </div>
  );
};

export default JobForm;