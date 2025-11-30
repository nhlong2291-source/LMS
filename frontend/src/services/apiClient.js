import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || "http://localhost:4000";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage if present
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Global response handler: if backend returns 401, clear auth and redirect to login (improves UX)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } catch (e) {}
      // redirect to login page in the app
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
