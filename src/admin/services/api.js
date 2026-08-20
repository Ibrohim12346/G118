import axios from "axios";

export const API_BASE = "/api";

export function getCookie(name) {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const csrf = getCookie("csrftoken");
  const method = (config.method || "get").toLowerCase();
  if (csrf && !["get", "head", "options"].includes(method)) {
    config.headers = config.headers || {};
    config.headers["X-CSRFToken"] = csrf;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

async function tryRefresh() {
  await axios.post(`${API_BASE}/auth/refresh/`, {}, { withCredentials: true });
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";

    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password") ||
      url.includes("/auth/register");

    if (error.response?.status !== 401 || !original || original._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject, config: original });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await tryRefresh();
      refreshQueue.forEach(({ resolve, config }) => resolve(api(config)));
      refreshQueue = [];
      return api(original);
    } catch (refreshError) {
      refreshQueue.forEach(({ reject }) => reject(refreshError));
      refreshQueue = [];
      const path = window.location.pathname;
      const isProtectedAdmin =
        path.startsWith("/admin/") &&
        !path.startsWith("/admin/login") &&
        !path.startsWith("/admin/forgot-password") &&
        !path.startsWith("/admin/reset-password");
      if (isProtectedAdmin) {
        window.location.assign("/admin/login");
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;