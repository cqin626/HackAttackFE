import { useCallback, useEffect, useState } from "react";
import { getEvents } from "../services/calenderService";
import Navbar from "../components/Navbar";
import type { AttendeeType, EventType } from "../models/Event";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import axios from "axios";
import { getHrEmail } from "../services/hrService";

export default function CalendarTestPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hrEmail, setHrEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getHrEmail()
      .then((data) => setHrEmail(data))
      .catch((err) => {
        const message = err?.message || "An unexpected error occurred";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  const fetchEvents = useCallback(async (email: string) => {
    try {
      const data = await getEvents(email);
      setEvents(data);
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = 'Session expired or unauthorized. Please log in again.';
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(`Failed to fetch events: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hrEmail) {
      fetchEvents(hrEmail);
    }
  }, [hrEmail, fetchEvents]);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">All Events</h1>
        <p>{hrEmail}</p>
        {/* Events section */}
        {loading ? (
          <div className="container py-5">
            <Spinner message="Loading events..." />
          </div>
        ) : (
          <table className="table table-hover mb-0">
            <tbody>
              {events.map((event, i) => (
                <tr key={i}>
                  <td className="border p-2">
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
