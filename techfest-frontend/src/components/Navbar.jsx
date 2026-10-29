import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const { cart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || "https://techfest-backend-r5rk.onrender.com/api"}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch {
      // Clear the local session even if the server is unavailable.
    }

    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        TechFest 2026
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/register">Register</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/contact">Contact</Link>

        <Link to="/cart">
          Cart 🛒 <span className="badge">{cart.length}</span>
        </Link>

        {user ? (
          <>
            {!isAdmin && (
              <Link to="/my-registrations">My Registrations</Link>
            )}

            {isAdmin && <Link to="/admin">Admin Dashboard</Link>}

            <span className="user-name">Hi, {user.name}</span>

            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/admin-login">Admin Login</Link>
          </>
        )}

        <button type="button" onClick={toggleTheme}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}