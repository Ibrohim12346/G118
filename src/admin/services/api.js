import axios from "axios";

export const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("odega_admin_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

async function tryRefresh() {
  const refreshToken = localStorage.getItem("odega_admin_refresh_token");
  if (!refreshToken) throw new Error("No refresh token");
  const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
  localStorage.setItem("odega_admin_token", data.data.accessToken);
  localStorage.setItem("odega_admin_refresh_token", data.data.refreshToken);
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
        localStorage.removeItem("odega_admin_token");
        localStorage.removeItem("odega_admin_refresh_token");
        window.location.assign("/admin/login");
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;