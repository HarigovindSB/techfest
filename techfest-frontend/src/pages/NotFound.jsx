import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page not-found">
      <h1>404 - Page Not Found</h1>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link to="/">Return Home</Link>
    </section>
  );
}
