import { useEffect, useState } from "react";
import { createEvent } from "../../services/calenderService";
import toast from "react-hot-toast";
import type { JobType } from "../../models/Job";

interface FormData {
  summary: string;
  description: string;
  start: string;
  end: string;
  email: string;
}

type ScheduleFormProps = {
  job: JobType,
  verifiedCandidateEmails: string[],
};

export default function ScheduleForm({ job, verifiedCandidateEmails }: ScheduleFormProps) {
  const [formData, setFormData] = useState<FormData>({
    summary: "",
    description: "",
    start: "",
    end: "",
    email: ""
  });

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  const validateForm = (): boolean => {
    const { summary, start, end, email } = formData;

    if (!summary.trim()) {
      toast.error("Summary is required");
      return false;
    }

    if (!start || !end) {
      toast.error("Start and end times are required");
      return false;
    }

    if (new Date(start) >= new Date(end)) {
      toast.error("End time must be after start time");
      return false;
    }

    if (!email.trim()) {
      toast.error("Attendee email is required");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      const parsedEmails = formData.email
        .split(";")
        .map((e) => e.trim())
        .filter((e) => e);

      const payload = {
        summary: formData.summary,
        description: formData.description,
        start: formData.start,
        end: formData.end,
        email: parsedEmails, // array of emails
      };

      await createEvent(payload);
      toast.success("Event created!");

      setFormData((prev) => ({
        summary: "",
        description: "",
        start: "",
        end: "",
        email: prev.email, // optionally keep for reuse
      }));
    } catch (err) {
      setError("Failed to create event: " + err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="px-2">
        <div className="grid gap-2 row">
          <h5>Create Event</h5>

          {/* Summary */}
          <div className="mb-2">
            <label htmlFor="summary" className="form-label">Summary</label>
            <input
              type="text"
              className="form-control"
              id="summary"
              name="summary"
              value={"Interview - " + job.title}
              onChange={handleChange}
              placeholder="Enter Summary"
            />
          </div>

          {/* Description */}
          <div className="mb-2">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={`Notes:\n\nPlease join the meeting 5 minutes early.\n\nEnsure all materials and questions are prepared in advance.\n\nFeedback to be submitted post-interview using the internal evaluation form.`}
              onChange={handleChange}
              placeholder="Enter Description"
              rows={5}
            />
          </div>


          {/* Start time */}
          <div className="mb-2">
            <label htmlFor="start" className="form-label">Start Time</label>
            <input
              type="datetime-local"
              className="form-control"
              id="start"
              name="start"
              // value="test"
              onChange={handleChange}
            />
          </div>

          {/* End time */}
          <div className="mb-2">
            <label htmlFor="end" className="form-label">End Time</label>
            <input
              type="datetime-local"
              className="form-control"
              id="end"
              name="end"
              // value="test"
              onChange={handleChange}
            />
          </div>

          {/* email */}
          <div className="mb-2">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={verifiedCandidateEmails.join(";")}
              onChange={handleChange}
              placeholder="Enter Email"
            />
          </div>
          <button type="submit" hidden></button>

          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="px-4 py-2 rounded">
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
