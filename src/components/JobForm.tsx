import { useEffect, useState } from "react";
import { createJob } from "../services/jobService";
import toast from "react-hot-toast";
import Spinner from "./Spinner.tsx";
import type { CreateJobType } from '../types/CreateJobType.ts';
import { Modal as BootstrapModal } from "bootstrap";
import type { JobType } from "../models/Job.ts";

type JobFormProps = {
  setNewJobData: (data: CreateJobType) => void;
  setShouldReloadJobs: React.Dispatch<React.SetStateAction<number>>;
  jobToEdit?: JobType | null;
};

const JobForm: React.FC<JobFormProps> = ({ setNewJobData, setShouldReloadJobs, jobToEdit }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // form fields
  const [title, setTitle] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [minSalary, setMinSalary] = useState<number | string>("");
  const [maxSalary, setMaxSalary] = useState<number | string>("");
  const [currency, setCurrency] = useState("MYR");
  const [status, setStatus] = useState("Open");

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setEmploymentType(jobToEdit.employmentType);
      setDescription(jobToEdit.description);
      setRequirements(jobToEdit.requirements.join(", "));
      setMinSalary(jobToEdit.salaryRange.min);
      setMaxSalary(jobToEdit.salaryRange.max);
      setCurrency(jobToEdit.salaryRange.currency);
      setStatus(jobToEdit.status);
    }
  }, [jobToEdit]);


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data: { [key: string]: FormDataEntryValue } = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const salaryRange = {
      min: Number(data["salaryRange[min]"]),
      max: Number(data["salaryRange[max]"]),
      currency: (data["salaryRange[currency]"] as string) || "MYR",
    };

    const requirements = data.requirements
      ? (data.requirements as string)
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
      : [];

    const jobDetails = {
      title: data.title as string,
      employmentType: data.employmentType as string,
      description: data.description as string,
      requirements,
      salaryRange,
      status: data.status as string,
    };

    setNewJobData(jobDetails);

    try {
      setLoading(true);
      await createJob(jobDetails);
      setShouldReloadJobs(prev => prev + 1);
      const modalElement = document.getElementById("addJobModal");
      if (modalElement) {
        const modal = BootstrapModal.getInstance(modalElement);
        modal?.hide();
        toast.success("Job Added");
      }
    } catch (error) {
      setError(`Failed to add job: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Spinner message="Adding Jobs"></Spinner>
    );
  }

  return (
    <div>
      <div className="container">
        <form id="jobForm" onSubmit={handleSubmit} noValidate>
          {/*Job Title*/}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Job Title</label>
            <input type="text" className="form-control" id="title" name="title" required value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/*Employment Type*/}
          <div className="mb-3">
            <label htmlFor="employmentType" className="form-label">Employment Type</label>
            <select className="form-select" id="employmentType" name="employmentType" required value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}>
              <option value="">Select type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/*Description*/}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Job Description</label>
            <textarea className="form-control" id="description" name="description" required value={description}
              onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          {/*Requirements*/}
          <div className="mb-3">
            <label htmlFor="requirements" className="form-label">Requirements (comma-separated)</label>
            <input type="text" className="form-control" id="requirements" name="requirements" placeholder="e.g. JavaScript, Node.js, MongoDB" value={requirements}
              onChange={(e) => setRequirements(e.target.value)}/>
          </div>

          {/*Salary Range*/}
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="minSalary" className="form-label">Minimum Salary</label>
              <input type="number" className="form-control" id="minSalary" name="salaryRange[min]" min="0" value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}/>
            </div>
            <div className="col-md-4">
              <label htmlFor="maxSalary" className="form-label">Maximum Salary</label>
              <input type="number" className="form-control" id="maxSalary" name="salaryRange[max]" min="0" value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}/>
            </div>
            <div className="col-md-4">
              <label htmlFor="currency" className="form-label">Currency</label>
              <input type="text" className="form-control" id="currency" name="salaryRange[currency]" value={currency}
              onChange={(e) => setCurrency(e.target.value)}/>
            </div>
          </div>

          {/* Status */}
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Job Status</label>
            <select className="form-select" id="status" name="status" value={status}
              onChange={(e) => setStatus(e.target.value)}>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
          <button type="submit" hidden></button>
        </form>
      </div>
    </div>
  )
}

export default JobForm
