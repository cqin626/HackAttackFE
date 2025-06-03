import { useCallback, useEffect, useState } from "react";
import { createEvent, getEvents } from "../services/calenderService";
import Navbar from "../components/Navbar";
import type { AttendeeType, EventType } from "../models/Event";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

interface FormData {
  summary: string;
  description: string;
  start: string;
  end: string;
  email: string;
}

export default function CalendarTestPage() {
  const [formData, setFormData] = useState<FormData>({
    summary: "",
    description: "",
    start: "",
    end: "",
    email: ""
  });

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const fetchEvents = useCallback(async (email: string) => {
    try {
      const data = await getEvents(email);
      setEvents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to fetch events: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(formData.email);
  }, [formData.email, fetchEvents]);

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
      await createEvent(formData);
      toast.success("Event created!");

      // Reset form
      setFormData(prev => ({
        summary: "",
        description: "",
        start: "",
        end: "",
        email: prev.email // Keep email for convenience
      }));
      fetchEvents(formData.email);
    } catch (err) {
      setError("Failed to create event: " + err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Create Event</h1>
        <div className="grid gap-2 mb-4">
          <input name="summary" onChange={handleChange} placeholder="Summary" className="border p-2" />
          <input name="description" onChange={handleChange} placeholder="Description" className="border p-2" />
          <input name="start" type="datetime-local" onChange={handleChange} className="border p-2" />
          <input name="end" type="datetime-local" onChange={handleChange} className="border p-2" />
          <input name="email" onChange={handleChange} placeholder="Attendee Email" className="border p-2" />
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-blue-500 px-4 py-2 rounded"          >
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

        {/* Events section */}
        {loading ? (
          <div className="container py-5">
            <Spinner message="Loading events..." />
          </div>
        ) : (
          <table className="table table-hover mb-0">
            <tbody>
              {events.map((event, i) => (
                <tr>
                  <td key={i} className="border p-2">
                    <div><strong>{event.summary}</strong></div>
                    <            div>Start: {new Date(event.start).toLocaleString()}</div>
                    <div>End: {new Date(event.end).toLocaleString()}</div>
                    <div>
                      Attendees: {event.attendees?.map((a: AttendeeType) => `${a.email} (${a.status})`).join(", ")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
