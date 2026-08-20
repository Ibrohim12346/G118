import { loadDb, saveDb } from "./db";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getOrders() {
  await delay(180);
  const db = loadDb();
  return [...db.orders].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
}

export async function getOrder(id) {
  await delay(140);
  const db = loadDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) throw new Error("Buyurtma topilmadi");
  return order;
}

export async function updateOrderStatus(id, { status, payment }) {
  await delay(220);
  const db = loadDb();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Buyurtma topilmadi");
  if (status) db.orders[idx].status = status;
  if (payment) db.orders[idx].payment = payment;
  db.orders[idx].updated_at = new Date().toISOString();
  saveDb(db);
  return db.orders[idx];
}

export async function deleteOrder(id) {
  await delay(200);
  const db = loadDb();
  db.orders = db.orders.filter((o) => o.id !== id);
  saveDb(db);
  return { ok: true };
}

export const ORDER_STATUS_META = {
  pending: { label: "Yangi", tone: "blue", icon: "FaClock" },
  confirmed: { label: "Tasdiqlangan", tone: "violet", icon: "FaCheck" },
  shipping: { label: "Yetkazilmoqda", tone: "amber", icon: "FaTruck" },
  delivered: { label: "Tugallangan", tone: "green", icon: "FaCheckDouble" },
  cancelled: { label: "Bekor qilingan", tone: "red", icon: "FaBan" },
};

export const PAYMENT_META = {
  paid: { label: "To‘langan", tone: "green" },
  pending: { label: "Kutilmoqda", tone: "amber" },
  unpaid: { label: "To‘lanmagan", tone: "red" },
};