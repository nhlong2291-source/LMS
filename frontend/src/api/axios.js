import axios from "axios";

// Default to port 5001 (your backend is running on 5001). Can be overridden with VITE_API_BASE.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// simple response interceptor to handle auth expiration
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      // we don't import router here; pages should handle redirect when detecting missing token
    }
    return Promise.reject(err);
  }
);

export default api;
