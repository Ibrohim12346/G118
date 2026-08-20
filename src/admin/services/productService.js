import { loadDb, saveDb, uid } from "./db";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function normalizeProduct(raw, categories) {
  const cat =
    categories.find((c) => c.id === raw.category) ||
    categories.find((c) => c.name === raw.category);
  return {
    ...raw,
    categoryName: cat ? cat.name : "Noma'lum",
    category: cat ? cat.id : "",
  };
}

export async function getProducts() {
  await delay(150);
  const db = loadDb();
  return db.products.map((p) => normalizeProduct(p, db.categories));
}

export async function getProduct(id) {
  await delay(120);
  const db = loadDb();
  const p = db.products.find((x) => x.id === id);
  if (!p) throw new Error("Mahsulot topilmadi");
  return normalizeProduct(p, db.categories);
}

export async function createProduct(data) {
  await delay(250);
  const db = loadDb();
  const product = {
    id: uid("prd"),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.products.unshift(product);
  saveDb(db);
  return normalizeProduct(product, db.categories);
}

export async function updateProduct(id, data) {
  await delay(250);
  const db = loadDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Mahsulot topilmadi");
  db.products[idx] = {
    ...db.products[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  saveDb(db);
  return normalizeProduct(db.products[idx], db.categories);
}

export async function deleteProduct(id) {
  await delay(200);
  const db = loadDb();
  const next = db.products.filter((p) => p.id !== id);
  if (next.length === db.products.length) throw new Error("Mahsulot topilmadi");
  db.products = next;
  saveDb(db);
  return { ok: true };
}

export async function getCategories() {
  const { getCategories: catFn } = await import("./categoryService");
  return catFn();
}

export function sortProducts(products, sortKey) {
  const key = sortKey || "newest";
  const arr = [...products];
  switch (key) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "stock":
      return arr.sort((a, b) => b.stock - a.stock);
    case "name":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export function filterProducts(products, filters = {}) {
  const q = (filters.search || "").trim().toLowerCase();
  return products.filter((p) => {
    if (q && !`${p.title} ${p.categoryName}`.toLowerCase().includes(q)) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    return true;
  });
}