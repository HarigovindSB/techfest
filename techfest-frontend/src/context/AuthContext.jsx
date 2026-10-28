import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Read the expiry time out of the JWT payload (the middle part)
function isExpired(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function loadUser() {
  const token = localStorage.getItem("token");
  if (!token || isExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    return null;
  }
  return {
    token,
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name"),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  // called after a successful POST /api/auth/login
  const login = ({ token, role, name }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    setUser({ token, role, name });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
