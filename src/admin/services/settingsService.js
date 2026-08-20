import { loadDb, saveDb } from "./db";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getSettings() {
  await delay(120);
  return loadDb().settings;
}

export async function updateSettings(patch) {
  await delay(200);
  const db = loadDb();
  db.settings = {
    ...db.settings,
    ...patch,
    notifications: { ...db.settings.notifications, ...patch.notifications },
    security: { ...db.settings.security, ...patch.security },
  };
  saveDb(db);
  return db.settings;
}

export async function updateNotifications(patch) {
  const db = loadDb();
  db.settings.notifications = { ...db.settings.notifications, ...patch };
  saveDb(db);
  return db.settings.notifications;
}

export async function updateSecurity(patch) {
  const db = loadDb();
  db.settings.security = { ...db.settings.security, ...patch };
  saveDb(db);
  return db.settings.security;
}

export async function getProfile() {
  await delay(120);
  return loadDb().profile;
}

export async function updateProfile(patch) {
  await delay(200);
  const db = loadDb();
  db.profile = { ...db.profile, ...patch };
  saveDb(db);
  return db.profile;
}

export async function changePassword(current, next) {
  await delay(250);
  if (!current || current.length < 4) throw new Error("Joriy parol noto‘g‘ri");
  if (next.length < 6) throw new Error("Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak");
  return { ok: true };
}