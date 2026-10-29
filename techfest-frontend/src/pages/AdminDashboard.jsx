import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import AddEventForm from "../components/AddEventForm";
import EventList from "../components/EventList";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const loadEvents = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/events");
      setEvents(res.data);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function deleteEvent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/events/${id}`);
      setMessage("Event deleted successfully.");
      setError("");
      await loadEvents();
    } catch (err) {
      setMessage("");
      setError(errorMessage(err));
    }
  }

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear the local session even if the logout request fails.
    }

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    navigate("/admin-login", { replace: true });
    window.location.reload();
  }

  return (
    <section className="page admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <p className="admin-eyebrow">TECHFEST ADMINISTRATION</p>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome, {user?.name || "Administrator"}. Manage your TechFest
            events here.
          </p>
        </div>

        <button type="button" className="danger" onClick={handleLogout}>
          Admin Logout
        </button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Events</span>
          <strong>{events.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Upcoming Events</span>
          <strong>
            {
              events.filter(
                (event) => new Date(event.date) >= new Date()
              ).length
            }
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Available Seats</span>
          <strong>
            {events.reduce((total, event) => total + Number(event.seats || 0), 0)}
          </strong>
        </div>
      </div>

      <div className="admin-dashboard-section">
        <h2>Add a New Event</h2>
        <p>Create an event that will appear on the public Events page.</p>

        <AddEventForm
          onAdded={async () => {
            setMessage("Event added successfully.");
            setError("");
            await loadEvents();
          }}
        />
      </div>

      <div className="admin-dashboard-section">
        <div className="admin-events-heading">
          <div>
            <h2>Manage Events</h2>
            <p>Review and remove existing events.</p>
          </div>

          <button type="button" onClick={loadEvents}>
            Refresh Events
          </button>
        </div>

        {message && <p className="info">{message}</p>}
        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Loading events...</p>}

        {!loading && events.length === 0 && !error && (
          <p className="admin-empty">
            No events found. Use the form above to add your first event.
          </p>
        )}

        {!loading && events.length > 0 && (
          <EventList
            events={events}
            onRegister={() => {
              setMessage(
                "Event registration is available from the public Events page."
              );
            }}
            onDelete={deleteEvent}
          />
        )}
      </div>
    </section>
  );
}
