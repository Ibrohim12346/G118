import api from "./api";

export function extractErrorMessage(error, fallback = "Nimadir xato ketdi.") {
  if (!error.response || error.response.status === 0 || error.response.status === 502 || error.response.status === 504) {
    return "Server bilan aloqa o'rnatib bo'lmadi. Internet connectionni tekshiring.";
  }
  const data = error.response.data;
  if (data && typeof data.message === "string" && data.message) {
    return data.message;
  }
  if (data && data.detail) {
    return typeof data.detail === "string" ? data.detail : fallback;
  }
  if (data && typeof data === "object") {
    for (const key of Object.keys(data)) {
      const value = data[key];
      if (Array.isArray(value) && value.length) return String(value[0]);
      if (typeof value === "string") return value;
    }
  }
  if (error.response.status === 401) return "Email yoki parol noto'g'ri.";
  if (error.response.status === 403) return "Sizda ushbu amalni bajarish huquqi mavjud emas.";
  if (error.response.status >= 500) return "Serverda xatolik yuz berdi. Keyinroq urinib ko'ring.";
  return fallback;
}

export async function loginRequest({ email, password, remember }) {
  const { data } = await api.post("/auth/login", { email, password, remember: !!remember });
  localStorage.setItem("odega_admin_token", data.data.accessToken);
  localStorage.setItem("odega_admin_refresh_token", data.data.refreshToken);
  return data;
}

export async function logoutRequest() {
  const refreshToken = localStorage.getItem("odega_admin_refresh_token");
  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch {
      // ignore
    }
  }
  localStorage.removeItem("odega_admin_token");
  localStorage.removeItem("odega_admin_refresh_token");
  return { success: true };
}

export async function getMeRequest() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function refreshRequest() {
  const refreshToken = localStorage.getItem("odega_admin_refresh_token");
  const { data } = await api.post("/auth/refresh", { refreshToken });
  localStorage.setItem("odega_admin_token", data.data.accessToken);
  localStorage.setItem("odega_admin_refresh_token", data.data.refreshToken);
  return data;
}

export async function registerRequest(payload) {
  const { data } = await api.post("/auth/register", payload);
  localStorage.setItem("odega_admin_token", data.data.accessToken);
  localStorage.setItem("odega_admin_refresh_token", data.data.refreshToken);
  return data;
}

export async function forgotPasswordRequest(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPasswordRequest(payload) {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
}

export async function changePasswordRequest(payload) {
  const { data } = await api.post("/auth/change-password", payload);
  return data;
}

export async function getUsersRequest(params = {}) {
  const { data } = await api.get("/users", { params });
  return data;
}

export async function updateUserRequest(userId, payload) {
  const { data } = await api.patch(`/users/${userId}`, payload);
  return data;
}

export async function deleteUserRequest(userId) {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
}

export async function getStatsRequest() {
  const { data } = await api.get("/stats");
  return data;
}