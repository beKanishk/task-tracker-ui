import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // 🚫 Do NOT attach token to auth endpoints
    if (token && !config.url.startsWith("/auth")) {
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

    // Only logout on AUTH failures
    if (status === 401 || status === 403) {
      console.warn("Auth error, redirecting to login");

      localStorage.removeItem("token");

      // Hard redirect avoids React stale state
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
