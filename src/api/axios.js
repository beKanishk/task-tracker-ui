import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token expired / invalid / unauthorized
    if (status === 401 || status === 403) {
      console.warn("Auth error, redirecting to login");

      localStorage.removeItem("token");

      // Hard redirect to avoid stale state
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
