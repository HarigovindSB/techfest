import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Seats now come from MongoDB (event.seats). The Events page owns the
// register / delete actions and passes them down as props.
export default function EventCard({ event, onRegister, onDelete }) {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  return (
    <div className="event-card">
      <h3>{event.name}</h3>

      <p>
        <strong>Category:</strong> {event.category}
      </p>

      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>

      <p>
        <strong>Fee:</strong> ₹{event.fee}
      </p>

      <p>
        <strong>Seats left:</strong> {event.seats}
      </p>

      <p>{event.description}</p>

      {event.seats === 0 ? (
        <button disabled>SOLD OUT</button>
      ) : (
        <div className="card-buttons">
          <button onClick={() => onRegister(event)}>Register</button>
          <button onClick={() => addToCart(event)}>🛒 Add to Cart</button>
        </div>
      )}

      {/* Hiding the button is only cosmetic - the server's adminOnly check is the real protection */}
      {isAdmin && (
        <button className="danger" onClick={() => onDelete(event._id)}>
          Delete
        </button>
      )}
    </div>
  );
}
