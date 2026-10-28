import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api, { errorMessage } from "../api";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    totalFee,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  // Register for every event in the cart, one POST /api/registrations each
  async function registerAll() {
    if (!user) {
      navigate("/login");
      return;
    }
    const out = [];
    for (const event of cart) {
      try {
        const res = await api.post("/registrations", { eventId: event._id });
        out.push(event.name + ": " + res.data.message);
        removeFromCart(event._id);
      } catch (err) {
        out.push(event.name + ": " + errorMessage(err));
      }
    }
    setResults(out);
  }

  return (
    <section className="page">
      <h1>🛒 My Cart</h1>

      {results.map((line) => (
        <p className="info" key={line}>{line}</p>
      ))}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>

          <p>
            Add an event from the registration page.
          </p>

          <Link
            to="/register"
            className="primary-button"
          >
            Go to Registration
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((event) => (
              <div
                className="cart-item"
                key={event._id}
              >
                <div>
                  <h3>{event.name}</h3>

                  <p>
                    Category: {event.category}
                  </p>

                  <p>
                    Registration Fee: ₹{event.fee}
                  </p>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(event._id)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>
              Total Events: {cart.length}
            </h2>

            <h2>
              Total Fee: ₹{totalFee}
            </h2>

            <button onClick={registerAll}>Register for all</button>

            <Link
              to="/register"
              className="primary-button"
            >
              Add More Events
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
