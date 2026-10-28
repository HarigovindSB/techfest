import { useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password });
      setMessage(res.data.message);
      setSuccess(true);
    } catch (err) {
      setMessage(errorMessage(err));
      setSuccess(false);
    }
  }

  return (
    <section className="page form-container">
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>

        {message && (
          <p className={success ? "info" : "error"}>{message}</p>
        )}

        {success && (
          <p>
            <Link to="/login">Go to Login</Link>
          </p>
        )}
      </form>
    </section>
  );
}
