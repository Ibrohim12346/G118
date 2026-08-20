import { getProfile } from "./settingsService";

const AUTH_KEY = "odega_admin_panel_session";

const CREDENTIALS = {
  email: "admin@odega.uz",
  password: "admin123",
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function login(email, password) {
  await delay(500);
  if (
    email.trim().toLowerCase() !== CREDENTIALS.email ||
    password !== CREDENTIALS.password
  ) {
    throw new Error("Email yoki parol noto‘g‘ri");
  }
  const profile = await getProfile();
  const session = {
    user: {
      id: profile.id,
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      avatar: profile.avatar,
    },
    token: `odega_${Math.random().toString(36).slice(2)}`,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getSession());
}

export async function refreshSessionUser() {
  const session = getSession();
  if (!session) return null;
  const profile = await getProfile();
  const next = {
    ...session,
    user: {
      id: profile.id,
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      avatar: profile.avatar,
    },
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  return next;
}