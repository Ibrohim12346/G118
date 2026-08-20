import { loadDb } from "./db";
import { formatCompact } from "./utils";

const DAY_MS = 86400000;

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function activeOrders(orders) {
  return orders.filter((o) => o.status !== "cancelled");
}

function sum(items) {
  return items.reduce((s, i) => s + i.total, 0);
}

export async function getDashboardStats() {
  const db = loadDb();
  const orders = activeOrders(db.orders);
  const now = new Date();

  const revenue = sum(orders);
  const monthOrders = orders.filter(
    (o) => startOfMonth(new Date(o.created_at)).getTime() === startOfMonth(now).getTime()
  );
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthOrders = orders.filter(
    (o) => startOfMonth(new Date(o.created_at)).getTime() === prevMonth.getTime()
  );

  const totalOrders = db.orders.length;
  const totalCustomers = db.customers.length;
  const totalProducts = db.products.length;
  const lowStock = db.products.filter((p) => p.stock <= 10).length;

  const revenueGrowth = prevMonthOrders.length
    ? ((sum(monthOrders) - sum(prevMonthOrders)) / sum(prevMonthOrders)) * 100
    : monthOrders.length
      ? 100
      : 0;
  const orderGrowth = prevMonthOrders.length
    ? ((monthOrders.length - prevMonthOrders.length) / prevMonthOrders.length) * 100
    : monthOrders.length
      ? 100
      : 0;

  return {
    totalProducts,
    totalOrders,
    totalCustomers,
    revenue,
    revenueCompact: formatCompact(revenue, db.settings.currency),
    revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    orderGrowth: Math.round(orderGrowth * 10) / 10,
    lowStock,
    monthOrders: monthOrders.length,
  };
}

export async function getSalesSeries(range = "daily") {
  const db = loadDb();
  const orders = activeOrders(db.orders);
  const now = new Date();
  const points = [];

  if (range === "daily") {
    for (let i = 29; i >= 0; i--) {
      const day = startOfDay(new Date(now.getTime() - i * DAY_MS));
      const next = day.getTime() + DAY_MS;
      const dayOrders = orders.filter((o) => {
        const t = new Date(o.created_at).getTime();
        return t >= day.getTime() && t < next;
      });
      points.push({
        key: `${day.getMonth() + 1}/${day.getDate()}`,
        label: day.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" }),
        sales: sum(dayOrders),
        orders: dayOrders.length,
      });
    }
  } else if (range === "weekly") {
    for (let i = 11; i >= 0; i--) {
      const week = startOfWeek(new Date(now.getTime() - i * 7 * DAY_MS));
      const next = week.getTime() + 7 * DAY_MS;
      const weekOrders = orders.filter((o) => {
        const t = new Date(o.created_at).getTime();
        return t >= week.getTime() && t < next;
      });
      const label = `${week.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" })}`;
      points.push({
        key: week.toISOString().slice(0, 10),
        label,
        sales: sum(weekOrders),
        orders: weekOrders.length,
      });
    }
  } else if (range === "monthly") {
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const next = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      const monthOrders = orders.filter((o) => {
        const t = new Date(o.created_at);
        return t >= month && t < next;
      });
      points.push({
        key: `${month.getFullYear()}-${month.getMonth()}`,
        label: month.toLocaleDateString("uz-UZ", { month: "short" }),
        sales: sum(monthOrders),
        orders: monthOrders.length,
      });
    }
  }

  return points;
}

export async function getTopProducts(limit = 5) {
  const db = loadDb();
  const counts = new Map();
  for (const order of activeOrders(db.orders)) {
    for (const item of order.items) {
      const entry = counts.get(item.productId) || {
        productId: item.productId,
        title: item.title,
        quantity: 0,
        revenue: 0,
      };
      entry.quantity += item.quantity;
      entry.revenue += item.price * item.quantity;
      counts.set(item.productId, entry);
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
    .map((p) => {
      const product = db.products.find((x) => x.id === p.productId);
      return { ...p, image: product ? product.image : "" };
    });
}

export async function getStatusBreakdown() {
  const db = loadDb();
  const meta = {
    pending: { label: "Yangi", color: "#2563eb" },
    confirmed: { label: "Tasdiqlangan", color: "#7c3aed" },
    shipping: { label: "Yetkazilmoqda", color: "#c98a1b" },
    delivered: { label: "Tugallangan", color: "#1a9e6c" },
    cancelled: { label: "Bekor qilingan", color: "#d64545" },
  };
  return Object.keys(meta).map((key) => ({
    key,
    ...meta[key],
    value: db.orders.filter((o) => o.status === key).length,
  }));
}

export async function getPaymentBreakdown() {
  const db = loadDb();
  const meta = {
    paid: { label: "To‘langan", color: "#1a9e6c" },
    pending: { label: "Kutilmoqda", color: "#c98a1b" },
    unpaid: { label: "To‘lanmagan", color: "#d64545" },
  };
  return Object.keys(meta).map((key) => ({
    key,
    ...meta[key],
    value: db.orders.filter((o) => o.payment === key).length,
  }));
}

export async function getRecentOrders(limit = 6) {
  const db = loadDb();
  return [...db.orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

export async function getCategoryPerformance() {
  const db = loadDb();
  const map = new Map();
  for (const order of activeOrders(db.orders)) {
    for (const item of order.items) {
      const product = db.products.find((p) => p.id === item.productId);
      const catId = product ? product.category : "unknown";
      const entry = map.get(catId) || { id: catId, label: "Noma'lum", sales: 0, quantity: 0 };
      entry.sales += item.price * item.quantity;
      entry.quantity += item.quantity;
      map.set(catId, entry);
    }
  }
  const sorted = [...map.values()].sort((a, b) => b.sales - a.sales);
  for (const entry of sorted) {
    const cat = db.categories.find((c) => c.id === entry.id);
    if (cat) entry.label = cat.name;
  }
  return sorted;
}