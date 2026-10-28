import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();

  return (
    <section className="page confirmation">
      <h1>Registration Successful! 🎉</h1>

      <p>
        Thank you, {location.state?.name || "Participant"}.
      </p>

      <p>Your TechFest 2026 registration has been received.</p>

      <Link to="/events">View More Events</Link>
    </section>
  );
}
