import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Welcome to TechFest 2026!",
    body: "Get ready to explore technology, innovation, and creativity at our annual technical festival.",
  },
  {
    id: 2,
    title: "Event Registrations Are Open",
    body: "Explore our exciting technical events and register to showcase your skills and compete with talented participants.",
  },
  {
    id: 3,
    title: "Get Ready for the Ultimate Tech Experience",
    body: "Join us for coding challenges, robotics competitions, design contests, and other exciting technical activities.",
  },
];

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setNews(ANNOUNCEMENTS);
    setLoading(false);
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Welcome to TechFest 2026</h1>

        <p>
          Explore technology, innovation, and creativity
          at our annual technical festival.
        </p>

        <Link to="/events" className="primary-button">
          Explore Events
        </Link>
      </section>

      <section className="page announcements">
        <h2>Announcements</h2>

        {loading && (
          <p className="loading">Loading announcements...</p>
        )}

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