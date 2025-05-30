import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { addAvailableDates } from "../services/scheduleService";

// Type definitions
interface DateRange {
  start: Date;
  end: Date;
  display: string;
}

interface FormattedDateRange {
  start: Date;
  end: Date;
}

// interface RouteParams {
//   userId?: string;
// }

const SchedulePage: React.FC = () => {
  // const { userId } = useParams<RouteParams>();
  const userId: string = "682de8d27fc257d0d6d5196e";
  const navigate = useNavigate();

  const [selectedDates, setSelectedDates] = useState<DateRange[]>([]);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Get today's date in YYYY-MM-DD format for min attribute
  const today: string = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const formatDateTimeToISO = (date: string, time: string): Date => {
    return new Date(`${date}T${time}:00.000+00:00`);
  };

  const handleAddDate = (): void => {
    if (!currentDate || !startTime || !endTime) {
      setError("Please fill in all fields");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }

    const startDateTime: Date = formatDateTimeToISO(currentDate, startTime);
    const endDateTime: Date = formatDateTimeToISO(currentDate, endTime);

    // Check for duplicate dates
    const isDuplicate: boolean = selectedDates.some((dateRange: DateRange) =>
      dateRange.start.getTime() === startDateTime.getTime() &&
      dateRange.end.getTime() === endDateTime.getTime()
    );

    if (isDuplicate) {
      setError("This date and time slot has already been added");
      return;
    }

    const newDateRange: DateRange = {
      start: startDateTime,
      end: endDateTime,
      display: `${currentDate} from ${startTime} to ${endTime}`
    };

    setSelectedDates([...selectedDates, newDateRange]);
    setCurrentDate("");
    setStartTime("");
    setEndTime("");
    setError("");
  };

  const handleRemoveDate = (index: number): void => {
    const updatedDates: DateRange[] = selectedDates.filter((_, i: number) => i !== index);
    setSelectedDates(updatedDates);
  };

  const handleSubmit = async (): Promise<void> => {
    if (selectedDates.length === 0) {
      setError("Please select at least one interview date");
      return;
    }

    if (!userId) {
      setError("User ID is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Format dates for API - remove display property
      const formattedDates: FormattedDateRange[] = selectedDates.map(({ start, end }: DateRange) => ({
        start,
        end
      }));

      await addAvailableDates(userId, formattedDates);
      setSuccess("Interview dates submitted successfully!");

      setSelectedDates([]);

    } catch (err: unknown) {
      setError("Failed to submit interview dates. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentDate(e.target.value);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEndTime(e.target.value);
  };

  const handleNavigateBack = (): void => {
    navigate(-1);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div>
              <div className="card-header">
                <h2>
                  Add Available Timeslots
                </h2>
              </div>

              <div className="card-body">
                <p className="text-muted mb-4">
                  Select your preferred interview dates and times. You can add multiple options.
                </p>

                {/* Add New Date Form */}
                <div className="border rounded p-4 mb-4 bg-light">

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="date" className="form-label">Date</label>
                      <input
                        type="date"
                        id="date"
                        className="form-control"
                        value={currentDate}
                        onChange={handleDateChange}
                        min={today}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="startTime" className="form-label">Start Time</label>
                      <input
                        type="time"
                        id="startTime"
                        className="form-control"
                        value={startTime}
                        onChange={handleStartTimeChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="endTime" className="form-label">End Time</label>
                      <input
                        type="time"
                        id="endTime"
                        className="form-control"
                        value={endTime}
                        onChange={handleEndTimeChange}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleAddDate}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Date
                    </button>
                  </div>
                </div>

                {/* Selected Dates List */}
                {selectedDates.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Selected Interview Dates</h5>
                    <div className="list-group">
                      {selectedDates.map((dateRange: DateRange, index: number) => (
                        <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i className="bi bi-calendar-event me-2 text-primary"></i>
                            {dateRange.display}
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveDate(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={handleNavigateBack}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedDates.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Submit Interview Dates ({selectedDates.length})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchedulePage;