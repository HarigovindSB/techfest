import { useEffect, useState } from "react";
import api, { errorMessage } from "../api";

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  const [status, setStatus] = useState("");

  const load = () =>
    api.get("/feedback").then((res) => setList(res.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/feedback", { name, message });
      setName("");
      setMessage("");
      setStatus("");
      load();
    } catch (err) {
      setStatus(errorMessage(err));
    }
  }

  return (
    <section className="page contact">
      <h1>Contact Us</h1>

      <p>
        Have questions about TechFest 2026?
      </p>

      <p>
        📧 Email: techfest@mbcet.ac.in
      </p>

      <p>
        📞 Phone: +91 98765 43210
      </p>

      <p>
        📍 Mar Baselios College of Engineering and Technology,
        <br />
        Mar Ivanios Vidyanagar, Nalanchira,
        <br />
        Thiruvananthapuram, Kerala - 695015
      </p>

      <h2>Find Us</h2>

      <div className="map-container">
        <iframe
          src="https://www.google.com/maps?q=Mar+Baselios+College+of+Engineering+and+Technology,+Nalanchira,+Thiruvananthapuram,+Kerala+695015&output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mar Baselios College of Engineering and Technology Location"
        ></iframe>
      </div>

      <h2>Feedback</h2>

      <form className="feedback-form" onSubmit={submit}>
        <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Your feedback" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Send Feedback</button>
        {status && <p className="error">{status}</p>}
      </form>

      {/* Exp 5 (XSS): user text is rendered as plain text by React, never as HTML */}
      <div className="cart-list">
        {list.map((f) => (
          <div className="cart-item" key={f._id}>
            <div>
              <h3>{f.name}</h3>
              <p>{f.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
