import { loadDb } from "./db";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function enrich(customer, orders) {
  const own = orders.filter((o) => o.customerId === customer.id);
  const totalSpent = own
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const lastOrder = own.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )[0];
  return {
    ...customer,
    orderCount: own.length,
    totalSpent,
    lastOrderAt: lastOrder ? lastOrder.created_at : null,
  };
}

export async function getCustomers() {
  await delay(160);
  const db = loadDb();
  return db.customers.map((c) => enrich(c, db.orders));
}

export async function getCustomer(id) {
  await delay(130);
  const db = loadDb();
  const customer = db.customers.find((c) => c.id === id);
  if (!customer) throw new Error("Mijoz topilmadi");
  const enriched = enrich(customer, db.orders);
  return {
    ...enriched,
    orders: db.orders
      .filter((o) => o.customerId === id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  };
}

export async function searchCustomers(q = "") {
  const all = await getCustomers();
  const query = q.trim().toLowerCase();
  if (!query) return all;
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.email.toLowerCase().includes(query)
  );
}