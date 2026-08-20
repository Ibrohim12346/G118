import { placeholderImage, uid } from "./utils";

const DB_KEY = "odega_admin_db_v1";

const STATUS_ORDER = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
const PAYMENTS = ["paid", "unpaid", "pending"];

function daysAgo(days, hour = 10, min = 30) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

function weightedStatus(ageDays) {
  const r = Math.random();
  if (ageDays > 60) {
    return r < 0.88 ? "delivered" : "cancelled";
  }
  if (ageDays > 25) {
    if (r < 0.72) return "delivered";
    if (r < 0.85) return "shipping";
    if (r < 0.95) return "confirmed";
    return "cancelled";
  }
  if (ageDays > 7) {
    if (r < 0.5) return "delivered";
    if (r < 0.68) return "shipping";
    if (r < 0.84) return "confirmed";
    if (r < 0.94) return "pending";
    return "cancelled";
  }
  if (r < 0.32) return "pending";
  if (r < 0.58) return "confirmed";
  if (r < 0.82) return "shipping";
  if (r < 0.94) return "delivered";
  return "cancelled";
}

function weightedPayment(status) {
  if (status === "cancelled") return "unpaid";
  if (status === "delivered") return Math.random() < 0.9 ? "paid" : "pending";
  return Math.random() < 0.45 ? "paid" : "pending";
}

const CATEGORY_DEFS = [
  { name: "Telefonlar", description: "Smartfonlar va aksessuarlar", image: null },
  { name: "Elektronika", description: "Gadjetlar, kompyuterlar va elektron qurilmalar", image: null },
  { name: "Maishiy texnika", description: "Uy-ro‘zg‘or uchun texnika", image: null },
  { name: "Kiyimlar", description: "Erkaklar, ayollar va bolalar kiyimlari", image: null },
  { name: "Sport", description: "Sport anjomlari va buyumlari", image: null },
  { name: "Kitoblar", description: "Badiiy va o‘quv adabiyotlar", image: null },
];

const PRODUCT_DEFS = [
  { title: "Samsung Galaxy S24 Ultra", category: "Telefonlar", price: 12500000, wholesale: 11800000, stock: 24, featured: true },
  { title: "iPhone 15 Pro Max", category: "Telefonlar", price: 14200000, wholesale: 13400000, stock: 18, featured: true },
  { title: "Redmi Note 13 Pro", category: "Telefonlar", price: 3200000, wholesale: 2980000, stock: 56, featured: false },
  { title: "AirPods Pro 2", category: "Elektronika", price: 1800000, wholesale: 1640000, stock: 42, featured: true },
  { title: "MacBook Air M3", category: "Elektronika", price: 18200000, wholesale: 17100000, stock: 9, featured: true },
  { title: "Aqlli soat Watch X7", category: "Elektronika", price: 890000, wholesale: 800000, stock: 63, featured: false },
  { title: "JBL Charge 5 kolonka", category: "Elektronika", price: 1400000, wholesale: 1280000, stock: 31, featured: false },
  { title: "Dazmol Philips GC", category: "Maishiy texnika", price: 520000, wholesale: 470000, stock: 45, featured: false },
  { title: "Chang yutgich Samsung", category: "Maishiy texnika", price: 1900000, wholesale: 1720000, stock: 14, featured: false },
  { title: "Konditsioner Gree", category: "Maishiy texnika", price: 4600000, wholesale: 4250000, stock: 7, featured: false },
  { title: "Kir yuvish mashinasi", category: "Maishiy texnika", price: 3900000, wholesale: 3600000, stock: 11, featured: false },
  { title: "Erkaklar kurtkasi", category: "Kiyimlar", price: 450000, wholesale: 390000, stock: 120, featured: true },
  { title: "Sport krasovkalar", category: "Kiyimlar", price: 680000, wholesale: 590000, stock: 84, featured: false },
  { title: "To‘qmoq Charm futcha", category: "Kiyimlar", price: 320000, wholesale: 270000, stock: 150, featured: false },
  { title: "Velosiped City 26", category: "Sport", price: 2800000, wholesale: 2550000, stock: 6, featured: true },
  { title: "Fitnes to‘plami gantel", category: "Sport", price: 750000, wholesale: 680000, stock: 38, featured: false },
  { title: "Yugurish yo‘lkasi", category: "Sport", price: 6200000, wholesale: 5700000, stock: 3, featured: false },
  { title: "Ilm-fan asoslari kitobi", category: "Kitoblar", price: 85000, wholesale: 70000, stock: 400, featured: false },
];

const CUSTOMER_DEFS = [
  { name: "Aziz Karimov", phone: "+998 90 123 45 67", email: "aziz.k@gmail.com", city: "Toshkent", registered: 320 },
  { name: "Nilufar Yusupova", phone: "+998 91 234 56 78", email: "nilufar.y@gmail.com", city: "Samarqand", registered: 260 },
  { name: "Jasur Toshmatov", phone: "+998 93 345 67 89", email: "jasur.t@mail.ru", city: "Buxoro", registered: 210 },
  { name: "Malika Rahimova", phone: "+998 94 456 78 90", email: "malika.r@gmail.com", city: "Toshkent", registered: 190 },
  { name: "Bekzod Alimov", phone: "+998 90 567 89 01", email: "bekzod.a@yandex.com", city: "Andijon", registered: 150 },
  { name: "Dilnoza Saidova", phone: "+998 95 678 90 12", email: "dilnoza.s@gmail.com", city: "Farg‘ona", registered: 140 },
  { name: "Shahzod Nazarov", phone: "+998 97 789 01 23", email: "shahzod.n@gmail.com", city: "Namangan", registered: 110 },
  { name: "Gulnora Ergasheva", phone: "+998 91 890 12 34", email: "gulnora.e@gmail.com", city: "Toshkent", registered: 95 },
  { name: "Ulug‘bek Mirzayev", phone: "+998 93 901 23 45", email: "ulugbek.m@mail.ru", city: "Qarshi", registered: 70 },
  { name: "Zulfiya Hamidova", phone: "+998 94 012 34 56", email: "zulfiya.h@gmail.com", city: "Nukus", registered: 55 },
  { name: "Temur Umarov", phone: "+998 90 222 33 44", email: "temur.u@gmail.com", city: "Toshkent", registered: 40 },
  { name: "Madina Qodirova", phone: "+998 95 555 66 77", email: "madina.q@gmail.com", city: "Termiz", registered: 30 },
  { name: "Otabek Xolmatov", phone: "+998 97 777 88 99", email: "otabek.x@gmail.com", city: "Xiva", registered: 18 },
  { name: "Sevara Tursunova", phone: "+998 91 999 00 11", email: "sevara.t@gmail.com", city: "Jizzax", registered: 6 },
];

function buildSeed() {
  const now = Date.now();

  const categories = CATEGORY_DEFS.map((c, i) => ({
    id: `cat_${i + 1}`,
    name: c.name,
    description: c.description,
    image: placeholderImage(c.name, i),
    created_at: daysAgo(400 - i * 20),
  }));

  const products = PRODUCT_DEFS.map((p, i) => {
    const cat = categories.find((c) => c.name === p.category);
    return {
      id: `prd_${i + 1}`,
      title: p.title,
      category: cat.id,
      price: p.price,
      wholesale_price: p.wholesale,
      stock: p.stock,
      image: placeholderImage(p.title, i),
      is_wholesale: true,
      is_featured: p.featured,
      status: "active",
      description: `${p.title} — ODEGA do'konidan rasmiy va kafolatli mahsulot. Sifat kafolati va tezkor yetkazib berish.`,
      created_at: daysAgo(340 - i * 12),
    };
  });

  const customers = CUSTOMER_DEFS.map((c, i) => ({
    id: `cus_${i + 1}`,
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: `${c.city}, O‘zbekiston`,
    registered_at: daysAgo(c.registered),
  }));

  const orders = [];
  for (let i = 0; i < 96; i++) {
    const age = Math.floor(Math.pow(Math.random(), 0.85) * 180);
    const hour = 9 + Math.floor(Math.random() * 11);
    const minute = Math.floor(Math.random() * 60);
    const created = daysAgo(age, hour, minute);
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const itemCount = 1 + Math.floor(Math.random() * 3);
    const used = new Set();
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      let pi = Math.floor(Math.random() * products.length);
      while (used.has(pi)) pi = Math.floor(Math.random() * products.length);
      used.add(pi);
      const prod = products[pi];
      const qty = 1 + Math.floor(Math.random() * (prod.price > 1000000 ? 2 : 4));
      items.push({
        productId: prod.id,
        title: prod.title,
        price: prod.price,
        quantity: qty,
      });
    }
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const status = weightedStatus(age);
    const payment = weightedPayment(status);
    orders.push({
      id: `ORD-${String(orders.length + 1001)}`,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      items,
      total,
      status,
      payment,
      note: "",
      created_at: created,
      updated_at: created,
    });
  }

  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    categories,
    products,
    customers,
    orders,
    settings: {
      currency: "so'm",
      language: "uz",
      theme: "light",
      storeName: "ODEGA",
      storeAddress: "Toshkent sh., Amir Temur ko‘chasi 1",
      storePhone: "+998 71 200 00 00",
      storeEmail: "info@odega.uz",
      notifications: {
        newOrder: true,
        orderStatus: true,
        lowStock: true,
        newsletter: false,
        reviews: true,
      },
      security: {
        twoFactor: false,
        sessionTimeout: 30,
        ipWhitelist: false,
        passwordStrength: "high",
      },
    },
    profile: {
      id: "adm_1",
      name: "Admin",
      fullName: "Aliyev Sardor",
      email: "admin@odega.uz",
      phone: "+998 90 000 00 00",
      role: "Bosh administrator",
      bio: "ODEGA do'koni bosh administratori. Mahsulotlar va buyurtmalarni boshqaradi.",
      avatar: "",
      joined: daysAgo(720),
    },
    _meta: {
      seedTime: now,
    },
  };
}

export function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.products && parsed.orders) return parsed;
    }
  } catch {
    /* corrupted storage -> reseed */
  }
  const db = buildSeed();
  saveDb(db);
  return db;
}

export function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* storage may be full -> ignore */
  }
}

export function resetDb() {
  localStorage.removeItem(DB_KEY);
  return loadDb();
}

export { STATUS_ORDER, PAYMENTS, uid };

export default { loadDb, saveDb, resetDb };