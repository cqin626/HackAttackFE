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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    getHrEmail()
      .then((data) => {
        if (data.success) {
          setHrEmail(data.email);
        } else {
          setError(data.error);
        }
      })
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

  // Helper functions for calendar view
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonthDays = (date: Date) => {
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 0);
    return prevMonth.getDate();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthDays = getPreviousMonthDays(currentDate);
    const days = [];
    const today = new Date();

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      const dayEvents = getEventsForDate(date);

      days.push(
        <div key={`prev-${day}`} className="calendar-day other-month">
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-time">{formatTime(event.start)}</div>
                <div className="event-title" title={event.summary}>
                  {event.summary}
                </div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="more-events">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div key={day} className={`calendar-day current-month ${isToday ? 'today' : ''}`}>
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-time">{formatTime(event.start)}</div>
                <div className="event-title" title={event.summary}>
                  {event.summary}
                </div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="more-events">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    // Next month's leading days to complete the grid (42 cells = 6 weeks)
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      const dayEvents = getEventsForDate(date);

      days.push(
        <div key={`next-${day}`} className="calendar-day other-month">
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-time">{formatTime(event.start)}</div>
                <div className="event-title" title={event.summary}>
                  {event.summary}
                </div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="more-events">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderListView = () => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    return (
      <div className="events-list">
        {sortedEvents.map((event, index) => (
          <div key={index} className="event-card card mb-3 border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="card-title mb-2 text-primary">
                    <i className="bi bi-calendar-event me-2"></i>
                    {event.summary}
                  </h5>
                  <div className="mb-2">
                    <i className="bi bi-clock me-2 text-secondary"></i>
                    <span className="fw-medium">
                      {new Date(event.start).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-hourglass-split me-2 text-secondary"></i>
                    <span>
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="attendees-section">
                    <div className="mb-2">
                      <i className="bi bi-people me-2 text-secondary"></i>
                      <span className="fw-medium">Attendees:</span>
                    </div>
                    <div className="attendees-list">
                      {event.attendees?.map((attendee: AttendeeType, i: number) => (
                        <div key={i} className="attendee-item mb-1">
                          <span className="badge bg-light text-dark me-2">
                            {attendee.email}
                          </span>
                          <span className={`badge ${
                            attendee.status === 'accepted' ? 'bg-success' :
                            attendee.status === 'declined' ? 'bg-danger' :
                            attendee.status === 'tentative' ? 'bg-warning' :
                            'bg-secondary'
                          }`}>
                            {attendee.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="container py-5">
          <Spinner message="Loading events..." />
        </div>
      ) : (
        <div className="container-fluid py-4 px-4 bg-light min-vh-100">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* Header */}
              <div className="section-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <h2 className="card-title mb-3 mb-md-0">
                  <i className="bi bi-calendar3 me-2 text-primary"></i>
                  Interview Schedule
                </h2>
                <div className="d-flex flex-column flex-md-row gap-2 align-items-center">
                  <div className="text-muted small">
                    <i className="bi bi-person-circle me-1"></i>
                    {hrEmail}
                  </div>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('calendar')}
                    >
                      <i className="bi bi-calendar3 me-1"></i>
                      Calendar
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="bi bi-list-ul me-1"></i>
                      List
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Navigation (only show in calendar view) */}
              {viewMode === 'calendar' && (
                <div className="calendar-navigation d-flex justify-content-between align-items-center mb-4">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <h3 className="mb-0 fw-bold text-primary">
                    {currentDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </h3>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              )}

              {/* Content */}
              {events.length === 0 ? (
                <div className="text-center py-5">
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-calendar-x text-secondary mb-3" style={{ fontSize: "3rem" }}></i>
                    <h4 className="text-secondary mb-2">No Events Scheduled</h4>
                    <p className="text-muted">Your interview schedule is currently empty.</p>
                  </div>
                </div>
              ) : viewMode === 'calendar' ? (
                <div className="calendar-view">
                  {/* Calendar Header */}
                  <div className="calendar-header row mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="col text-center fw-bold text-secondary py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  {/* Calendar Grid */}
                  <div className="calendar-grid row g-1">
                    {renderCalendarView()}
                  </div>
                </div>
              ) : (
                renderListView()
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS */}
      <style>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
        }
        
        .calendar-grid .calendar-day {
          min-height: 120px;
          border: 1px solid #e9ecef;
          padding: 8px;
          background: white;
          transition: background-color 0.2s;
          display: flex;
          flex-direction: column;
        }
        
        .calendar-day:hover {
          background-color: #f8f9fa;
        }
        
        .calendar-day.today {
          background-color: #fff3cd;
          border-color: #ffc107;
          box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.25);
        }
        
        .calendar-day.other-month {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .calendar-day.other-month .day-number {
          color: #adb5bd;
        }
        
        .calendar-day.current-month {
          background-color: white;
        }
        
        .day-number {
          font-weight: bold;
          margin-bottom: 4px;
          color: #495057;
          font-size: 0.9rem;
        }
        
        .today .day-number {
          color: #856404;
          font-weight: 900;
        }
        
        .day-events {
          flex: 1;
          overflow: hidden;
        }
        
        .event-item {
          background: #e3f2fd;
          border-left: 3px solid #2196f3;
          padding: 2px 6px;
          margin-bottom: 2px;
          border-radius: 2px;
          font-size: 0.75rem;
        }
        
        .other-month .event-item {
          opacity: 0.6;
        }
        
        .event-time {
          font-weight: bold;
          color: #1976d2;
        }
        
        .event-title {
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .more-events {
          font-size: 0.7rem;
          color: #666;
          text-align: center;
          padding: 2px;
        }
        
        .attendee-item {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .calendar-header .col {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
        }
        
        @media (max-width: 768px) {
          .calendar-day {
            min-height: 80px;
            padding: 4px;
          }
          
          .event-item {
            font-size: 0.7rem;
          }
          
          .day-number {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
}