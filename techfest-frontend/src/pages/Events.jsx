import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import EventList from "../components/EventList";
import AddEventForm from "../components/AddEventForm";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // GET /api/events  (named function so we can call it again after a change)
  function loadEvents() {
    return api
      .get("/events")
      .then((res) => {
        setEvents(res.data);
        setError("");
      })
      .catch(() => setError("Could not load events"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // POST /api/registrations  (needs a logged-in user)
  async function registerForEvent(event) {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.post("/registrations", { eventId: event._id });
      setMessage(res.data.message + " - " + event.name);
      loadEvents(); // refresh: seats go down
    } catch (err) {
      setMessage(errorMessage(err));
    }
  }

  // DELETE /api/events/:id  (admin only)
  async function deleteEvent(id) {
    try {
      await api.delete("/events/" + id);
      setMessage("Event deleted");
      loadEvents();
    } catch (err) {
      setMessage(errorMessage(err));
    }
  }

  const categories = ["All", ...new Set(events.map((e) => e.category))];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || event.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "fee") return a.fee - b.fee;
    if (sortBy === "seats") return b.seats - a.seats;
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    return a.name.localeCompare(b.name);
  });

  return (
    <section className="page">
      <h1>TechFest Events</h1>

      {isAdmin && <AddEventForm onAdded={loadEvents} />}

      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="fee">Sort: Fee (low to high)</option>
          <option value="seats">Sort: Seats left</option>
          <option value="date">Sort: Date</option>
        </select>
      </div>

      {message && <p className="info">{message}</p>}
      {loading && <p className="loading">Loading events...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (
        <EventList
          events={sortedEvents}
          onRegister={registerForEvent}
          onDelete={deleteEvent}
        />
      )}

      {!loading && !error && filteredEvents.length === 0 && (
        <p>No matching events found.</p>
      )}
    </section>
  );
}
