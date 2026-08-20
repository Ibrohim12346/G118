import { loadDb, saveDb, uid } from "./db";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getCategories() {
  await delay(150);
  const db = loadDb();
  return db.categories.map((c) => ({
    ...c,
    productCount: db.products.filter((p) => p.category === c.id).length,
  }));
}

export async function getCategory(id) {
  await delay(120);
  const db = loadDb();
  const c = db.categories.find((x) => x.id === id);
  if (!c) throw new Error("Kategoriya topilmadi");
  return {
    ...c,
    productCount: db.products.filter((p) => p.category === id).length,
  };
}

export async function createCategory(data) {
  await delay(250);
  const db = loadDb();
  const name = (data.name || "").trim();
  if (!name) throw new Error("Kategoriya nomini kiriting");
  if (db.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Bu nomdagi kategoriya allaqachon mavjud");
  }
  const category = {
    id: uid("cat"),
    name,
    description: data.description || "",
    image: data.image || "",
    created_at: new Date().toISOString(),
  };
  db.categories.push(category);
  saveDb(db);
  return { ...category, productCount: 0 };
}

export async function updateCategory(id, data) {
  await delay(250);
  const db = loadDb();
  const idx = db.categories.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Kategoriya topilmadi");
  const name = (data.name || "").trim();
  if (!name) throw new Error("Kategoriya nomini kiriting");
  if (
    db.categories.some(
      (c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    throw new Error("Bu nomdagi kategoriya allaqachon mavjud");
  }
  db.categories[idx] = {
    ...db.categories[idx],
    name,
    description: data.description ?? db.categories[idx].description,
    image: data.image ?? db.categories[idx].image,
  };
  saveDb(db);
  const count = db.products.filter((p) => p.category === id).length;
  return { ...db.categories[idx], productCount: count };
}

export async function deleteCategory(id) {
  await delay(200);
  const db = loadDb();
  const count = db.products.filter((p) => p.category === id).length;
  if (count > 0) {
    throw new Error(
      `Bu kategoriyada ${count} ta mahsulot bor. Avval mahsulotlarni boshqa kategoriyaga o'tkazing`
    );
  }
  db.categories = db.categories.filter((c) => c.id !== id);
  saveDb(db);
  return { ok: true };
}