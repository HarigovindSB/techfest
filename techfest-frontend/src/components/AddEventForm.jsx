import { useState } from "react";
import api, { errorMessage } from "../api";

const empty = { name: "", category: "", fee: "", seats: "", date: "", description: "" };

// Admin only: POST /api/events
export default function AddEventForm({ onAdded }) {
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/events", {
        ...form,
        fee: Number(form.fee),
        seats: Number(form.seats),
      });
      setForm(empty);
      setMessage("");
      onAdded();
    } catch (err) {
      setMessage(errorMessage(err));
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Add a new event (admin)</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="fee" type="number" min="0" placeholder="Fee" value={form.fee} onChange={handleChange} />
      <input name="seats" type="number" min="0" placeholder="Seats" value={form.seats} onChange={handleChange} />
      <input name="date" type="date" value={form.date} onChange={handleChange} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <button type="submit">Add Event</button>
      {message && <p className="error">{message}</p>}
    </form>
  );
}
