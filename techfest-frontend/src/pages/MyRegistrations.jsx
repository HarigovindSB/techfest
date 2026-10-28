import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";

export default function MyRegistrations() {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/registrations/my")
      .then((res) => setList(res.data))
      .catch((err) =>
        setMessage(err.response?.status === 401 ? "Please login first" : errorMessage(err))
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <h1>My Registrations</h1>

      {loading && <p className="loading">Loading...</p>}
      {message && <p className="error">{message}</p>}

      {!loading && !message && list.length === 0 && (
        <p>
          You have not registered for any event yet.{" "}
          <Link to="/events">Browse events</Link>
        </p>
      )}

      <div className="cart-list">
        {list.map((r) => (
          <div className="cart-item" key={r._id}>
            <div>
              <h3>{r.event.name}</h3>
              <p>Category: {r.event.category}</p>
              <p>Fee: ₹{r.event.fee}</p>
              <p>
                Registered on {new Date(r.registeredAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
