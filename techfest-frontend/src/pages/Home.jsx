import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Exp 3 Q6: public API (JSONPlaceholder) with loading and error states
const PUBLIC_API = "https://jsonplaceholder.typicode.com/posts?_limit=3";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios
      .get(PUBLIC_API)
      .then((res) => active && setNews(res.data))
      .catch(() => active && setError("Could not load announcements"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Welcome to TechFest 2026</h1>

        <p>
          Explore technology, innovation and creativity
          at our annual technical festival.
        </p>

        <Link to="/events" className="primary-button">
          Explore Events
        </Link>
      </section>

      <section className="page announcements">
        <h2>Announcements</h2>
        {loading && <p className="loading">Loading announcements...</p>}
        {error && <p className="error">{error}</p>}
        <div className="event-grid">
          {news.map((item) => (
            <div className="event-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
