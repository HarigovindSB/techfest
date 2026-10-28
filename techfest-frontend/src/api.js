import axios from "axios";

// Backend URL, including the /api prefix.
export const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://techfest-backend-r5rk.onrender.com/api"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Return a useful error message.
export function errorMessage(err) {
  if (err.response) {
    return (
      err.response.data?.message ||
      `Request failed with status ${err.response.status}`
    );
  }

  if (err.request) {
    return "Could not reach the server. Check your connection and try again.";
  }

  return err.message || "An unexpected error occurred.";
}

export default api;
