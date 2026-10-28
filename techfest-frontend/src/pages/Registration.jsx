import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api, { errorMessage } from "../api";

export default function Registration() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    event: "",
  });

  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);
  const [serverMessage, setServerMessage] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Populate the name field when the logged-in user's details are available.
  useEffect(() => {
    if (user?.name) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name,
      }));
    }
  }, [user]);

  // Load events from the backend.
  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        setLoadingEvents(true);

        const res = await api.get("/events");

        if (!Array.isArray(res.data)) {
          throw new Error("Unexpected events response from the server");
        }

        if (active) {
          setEvents(res.data);
          setServerMessage("");
        }
      } catch (err) {
        console.error("Failed to load events:", err);

        if (active) {
          setEvents([]);
          setServerMessage(
            `Could not load events. ${errorMessage(err)}`
          );
        }
      } finally {
        if (active) {
          setLoadingEvents(false);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  // Handle input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the validation error for the field being edited.
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validate the registration form.
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!form.college.trim()) {
      newErrors.college = "College is required";
    }

    if (!form.event) {
      newErrors.event = "Please select an event";
    }

    return newErrors;
  };

  // Add the selected event to the cart.
  const handleAddToCart = () => {
    setServerMessage("");

    if (!form.event) {
      setErrors((prev) => ({
        ...prev,
        event: "Please select an event first",
      }));
      return;
    }

    const selectedEvent = events.find(
      (event) => event._id === form.event
    );

    if (!selectedEvent) {
      setServerMessage(
        "The selected event could not be found. Please reload the events."
      );
      return;
    }

    try {
      addToCart(selectedEvent);
      setErrors({});

      alert(`${selectedEvent.name} added to cart!`);
    } catch (err) {
      console.error("Failed to add event to cart:", err);
      setServerMessage("Could not add the event to your cart.");
    }
  };

  // Submit the event registration.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!user) {
      setServerMessage("Please login first.");
      navigate("/login");
      return;
    }

    const selectedEvent = events.find(
      (event) => event._id === form.event
    );

    if (!selectedEvent) {
      setServerMessage(
        "The selected event is unavailable. Please select another event."
      );
      return;
    }

    try {
      setSubmitting(true);

      // The backend identifies the user using the authentication token.
      await api.post("/registrations", {
        eventId: selectedEvent._id,
      });

      navigate("/confirmation", {
        state: {
          name: form.name,
          event: selectedEvent.name,
        },
      });
    } catch (err) {
      console.error("Registration failed:", err);

      if (err.response?.status === 401) {
        setServerMessage("Your session may have expired. Please log in again.");
      } else {
        setServerMessage(errorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page form-container">
      <h1>Event Registration</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
        {errors.name && <small className="error">{errors.name}</small>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        {errors.email && <small className="error">{errors.email}</small>}

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="10-digit phone number"
          maxLength={10}
          required
        />
        {errors.phone && <small className="error">{errors.phone}</small>}

        <label htmlFor="college">College</label>
        <input
          id="college"
          type="text"
          name="college"
          value={form.college}
          onChange={handleChange}
          placeholder="Enter your college"
          required
        />
        {errors.college && (
          <small className="error">{errors.college}</small>
        )}

        <label htmlFor="event">Select Event</label>
        <select
          id="event"
          name="event"
          value={form.event}
          onChange={handleChange}
          disabled={loadingEvents || events.length === 0}
          required
        >
          <option value="">
            {loadingEvents ? "Loading events..." : "Choose an event"}
          </option>

          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.name} - ₹{event.fee}
            </option>
          ))}
        </select>

        {errors.event && <small className="error">{errors.event}</small>}

        {loadingEvents && <p>Loading events...</p>}

        {!loadingEvents && events.length === 0 && (
          <p className="error">
            No events are available. Please try again later.
          </p>
        )}

        {serverMessage && (
          <p className="error" role="alert">
            {serverMessage}
          </p>
        )}

        <div className="registration-buttons">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loadingEvents || events.length === 0}
          >
            🛒 Add to Cart
          </button>

          <button
            type="submit"
            disabled={submitting || loadingEvents || events.length === 0}
          >
            {submitting ? "Registering..." : "Register Now"}
          </button>
        </div>
      </form>
    </section>
  );
}
