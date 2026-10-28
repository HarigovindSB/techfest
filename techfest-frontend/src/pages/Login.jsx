import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data); // saves token, role and name in localStorage
      navigate("/events");
    } catch (err) {
      setMessage(errorMessage(err));
    }
  }

  return (
    <section className="page form-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>

        {message && <p className="error">{message}</p>}

        <p>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </section>
  );
}
