import axios from "axios";

/**
 * Real REST API client — ODEGA admin paneli kelajakda real
 * backendga ulanganda quyidagi bazaviy konfiguratsiya ishlatiladi.
 * Hozirda admin panel localStorage orqali to'liq ishlaydigan
 * mock ma'lumotlar bazasidan foydalanadi (services/db.js).
 */
const apiClient = axios.create({
  baseURL: "/api",
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem("odega_admin_session");
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Token ${token}`;
    } catch {
      /* ignore */
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Server bilan bog‘lanishda xatolik";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

/**
 * REST endpointlar xaritasi — xizmat qatlamini real backendga
 * ulash uchun tayyor shablon.
 *
 *   products:    GET/POST   /products/
 *                GET/PUT/PATCH/DELETE  /products/:id/
 *   categories:  GET/POST   /categories/
 *                GET/PUT/DELETE  /categories/:id/
 *   orders:      GET        /orders/
 *                PATCH      /orders/:id/
 *   customers:   GET        /customers/
 *   auth:        POST       /auth/login/
 *   profile:     GET/PUT    /profile/
 *   stats:       GET        /dashboard/stats/
 *                GET        /dashboard/sales/?range=daily|weekly|monthly
 *                GET        /dashboard/top-products/
 */