import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaColumns,
  FaBoxOpen,
  FaBox,
  FaBoxes,
  FaShoppingCart,
  FaShoppingBag,
  FaTruck,
  FaEnvelope,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
  FaMoon,
  FaSun,
  FaClock,
  FaMoneyBillWave,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaStar,
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaCreditCard,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaPaperPlane,
  FaCheckDouble,
  FaEllipsisV,
  FaCheck,
  FaFire,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaUsers,
  FaEdit,
  FaDownload,
  FaHeadset,
  FaTags,
  FaChartLine,
  FaChartBar,
  FaFileAlt,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaWallet,
  FaStore,
  FaPalette,
  FaCamera,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaLock,
  FaKey,
  FaPrint,
  // FaPackage,
  FaTshirt,
  FaChild,
  FaCalendarAlt,
  FaHourglassStart,
  FaTimesCircle,
  FaInfoCircle,
  FaInstagram,
  FaTelegramPlane,
  FaFacebookF,
  FaLink,
  FaBuilding,
  FaIdCard,
  FaUserCog,
  FaUserShield,
  FaLandmark,
  FaUndo,
  FaFileInvoiceDollar,
  FaPercentage,
  FaImage,
  FaExternalLinkAlt,
  FaSyncAlt,
  FaArrowLeft,
  FaSortAmountDown,
  FaPause,
  FaPlay,
  FaBan,
} from "react-icons/fa";

import "./SellerDashboard.css";

/* =========================================================
   HELPERS
========================================================= */

function formatSum(value) {
  const n = Math.round(Number(value) || 0);
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}

function formatShortSum(value) {
  const n = Number(value) || 0;
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + " mlrd";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + " mln";
  if (n >= 1000) return Math.round(n / 1000) + " ming";
  return String(n);
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return d + "." + m + "." + y;
}

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

function monthLabel(iso) {
  const [y, m] = iso.split("-");
  return MONTHS[Number(m) - 1] + " " + y;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return fallback;
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* =========================================================
   SELLER
========================================================= */

const SELLER = {
  name: "Ebr Gimming",
  firstName: "Ebr",
  shop: "Abu Sahiy G-118",
  initials: "EG",
  email: "ebr.gimming@dukoni.uz",
  phone: "+998 90 123 45 67",
  address: "Toshkent sh., Chorsu bozori, G-118 do'koni",
  registered: "2024-yil 18-mart",
  verified: true,
  rating: 4.8,
  bio: "Bolalar kiyim-kechaklari ulgurji savdosi. 2 yildan ortiq tajriba, 500+ do'konlar bilan hamkorlik.",
  balance: 8450000,
  pending: 2450000,
  totalEarnings: 48600000,
  withdrawn: 37700000,
};

const NOTIF_KEY = "seller_dash_notifications";

/* =========================================================
   IMAGES (working Unsplash urls)
========================================================= */

const IMG = {
  jacket: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
  hoodie: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  shirt: "https://images.unsplash.com/photo-1603252109303-2751441dd157",
  dress: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d",
  sneakers: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  bag: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
  coat: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3",
  polo: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
  scarf: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9",
};

/* =========================================================
   STATUS META
========================================================= */

const ORDER_STATUS = {
  yangi: { label: "Yangi", tone: "info", icon: FaHourglassStart },
  tasdiqlangan: { label: "Tasdiqlangan", tone: "primary", icon: FaCheckCircle },
  tayyorlanmoqda: { label: "Tayyorlanmoqda", tone: "warning", icon: FaClock },
  jonatildi: { label: "Jo'natildi", tone: "purple", icon: FaTruck },
  yetkazildi: { label: "Yetkazildi", tone: "success", icon: FaCheckCircle },
  bekor_qilindi: { label: "Bekor qilindi", tone: "danger", icon: FaTimesCircle },
};

const PRODUCT_STATUS = {
  active: { label: "Aktiv", tone: "success" },
  out_of_stock: { label: "Tugagan", tone: "danger" },
  draft: { label: "Qoralama", tone: "warning" },
  hidden: { label: "Yashiringan", tone: "muted" },
};

const CUSTOMER_STATUS = {
  faol: { label: "Faol", tone: "success" },
  yangi: { label: "Yangi", tone: "info" },
  bloklangan: { label: "Bloklangan", tone: "danger" },
};

const TRANSACTION_META = {
  sotuv: { label: "Sotuv", tone: "success" },
  yechib_olish: { label: "Yechib olish", tone: "info" },
  qaytarish: { label: "Qaytarish", tone: "danger" },
  "to'lov": { label: "To'lov", tone: "primary" },
};

const TRANSACTION_STATUS = {
  muvaffaqiyatli: { label: "Muvaffaqiyatli", tone: "success" },
  kutilmoqda: { label: "Kutilmoqda", tone: "warning" },
  bekor: { label: "Bekor qilingan", tone: "danger" },
};

/* =========================================================
   PRODUCTS
========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Bolalar futbolkasi Premium",
    sku: "BFT-001",
    category: "Bolalar kiyimlari",
    subcategory: "Futbolkalar",
    wholesalePrice: 25000,
    retailPrice: 40000,
    discount: 0,
    stock: 320,
    minOrder: 10,
    sales: 1280,
    status: "active",
    image: IMG.shirt,
    sizes: ["3-4", "5-6", "7-8", "9-10"],
    colors: ["Oq", "Ko'k", "Sariq"],
    ageGroup: "Bolalar (2-10)",
    gender: "Unisex",
    material: "95% Paxta, 5% Lika",
    season: "Yoz",
  },
  {
    id: 2,
    name: "Bolalar jinsi shim",
    sku: "BJS-002",
    category: "Bolalar kiyimlari",
    subcategory: "Shimlar",
    wholesalePrice: 45000,
    retailPrice: 70000,
    discount: 5,
    stock: 180,
    minOrder: 10,
    sales: 860,
    status: "active",
    image: IMG.jeans,
    sizes: ["3-4", "5-6", "7-8", "9-10"],
    colors: ["Ko'k", "To'q ko'k"],
    ageGroup: "Bolalar (2-10)",
    gender: "O'g'il",
    material: "98% Paxta denim",
    season: "Barcha mavsum",
  },
  {
    id: 3,
    name: "Bolalar qishki ko'ylagi",
    sku: "BQK-003",
    category: "Bolalar kiyimlari",
    subcategory: "Kurtkalar",
    wholesalePrice: 120000,
    retailPrice: 180000,
    discount: 0,
    stock: 96,
    minOrder: 5,
    sales: 420,
    status: "active",
    image: IMG.jacket,
    sizes: ["4-5", "6-7", "8-9", "10-11"],
    colors: ["Qizil", "Ko'k", "Yashil"],
    ageGroup: "Bolalar (2-10)",
    gender: "Unisex",
    material: "Poliester, izolyatsiya",
    season: "Qish",
  },
  {
    id: 4,
    name: "Bolalar svitcheri",
    sku: "BSV-004",
    category: "Bolalar kiyimlari",
    subcategory: "Sviterlar",
    wholesalePrice: 55000,
    retailPrice: 85000,
    discount: 10,
    stock: 0,
    minOrder: 10,
    sales: 710,
    status: "out_of_stock",
    image: IMG.hoodie,
    sizes: ["3-4", "5-6", "7-8", "9-10"],
    colors: ["Kulrang", "To'q kulrang"],
    ageGroup: "Bolalar (2-10)",
    gender: "Unisex",
    material: "80% Paxta, 20% Poliester",
    season: "Kuz",
  },
  {
    id: 5,
    name: "Bolalar ko'ylagi (qizlar)",
    sku: "BKK-005",
    category: "Bolalar kiyimlari",
    subcategory: "Ko'ylaklar",
    wholesalePrice: 80000,
    retailPrice: 120000,
    discount: 0,
    stock: 140,
    minOrder: 10,
    sales: 540,
    status: "active",
    image: IMG.dress,
    sizes: ["3-4", "5-6", "7-8"],
    colors: ["Pushti", "Oq", "Och binafsha"],
    ageGroup: "Bolalar (2-10)",
    gender: "Qiz",
    material: "100% Paxta",
    season: "Yoz",
  },
  {
    id: 6,
    name: "Bolalar krasovkasi",
    sku: "BKR-006",
    category: "Poyabzallar",
    subcategory: "Krasovkalar",
    wholesalePrice: 90000,
    retailPrice: 135000,
    discount: 15,
    stock: 64,
    minOrder: 5,
    sales: 390,
    status: "draft",
    image: IMG.sneakers,
    sizes: ["26", "27", "28", "29", "30"],
    colors: ["Oq", "Qora", "Qizil"],
    ageGroup: "Bolalar (2-10)",
    gender: "Unisex",
    material: "Charm, kauchuk",
    season: "Barcha mavsum",
  },
  {
    id: 7,
    name: "Bolalar sharfi",
    sku: "BSH-007",
    category: "Aksessuarlar",
    subcategory: "Sharf",
    wholesalePrice: 18000,
    retailPrice: 30000,
    discount: 0,
    stock: 45,
    minOrder: 20,
    sales: 120,
    status: "hidden",
    image: IMG.scarf,
    sizes: ["Yagona"],
    colors: ["Ko'k", "Pushti", "Sariq"],
    ageGroup: "Bolalar (2-10)",
    gender: "Unisex",
    material: "Akril",
    season: "Qish",
  },
  {
    id: 8,
    name: "Bolalar paltosi",
    sku: "BPT-008",
    category: "Bolalar kiyimlari",
    subcategory: "Paltolar",
    wholesalePrice: 140000,
    retailPrice: 210000,
    discount: 0,
    stock: 12,
    minOrder: 3,
    sales: 210,
    status: "active",
    image: IMG.coat,
    sizes: ["5-6", "7-8", "9-10", "11-12"],
    colors: ["To'q ko'k", "Jigarrang"],
    ageGroup: "Bolalar (2-10)",
    gender: "Unisex",
    material: "Drapp, astar",
    season: "Qish",
  },
];

/* =========================================================
   ORDERS
========================================================= */

const ORDERS = [
  {
    id: 10182,
    number: "SD-10182",
    date: "2026-08-18",
    customer: "Nilufar Rahimova",
    phone: "+998 91 234 56 78",
    items: [
      { name: "Bolalar futbolkasi Premium", image: IMG.shirt, qty: 40, price: 25000 },
      { name: "Bolalar jinsi shim", image: IMG.jeans, qty: 20, price: 45000 },
    ],
    amount: 1900000,
    payment: "Karta",
    status: "yangi",
  },
  {
    id: 10181,
    number: "SD-10181",
    date: "2026-08-17",
    customer: "Sardor To'rayev",
    phone: "+998 93 456 78 90",
    items: [{ name: "Bolalar qishki ko'ylagi", image: IMG.jacket, qty: 25, price: 120000 }],
    amount: 3000000,
    payment: "Naqd",
    status: "tayyorlanmoqda",
  },
  {
    id: 10180,
    number: "SD-10180",
    date: "2026-08-16",
    customer: "Madina Yusupova",
    phone: "+998 90 111 22 33",
    items: [
      { name: "Bolalar ko'ylagi (qizlar)", image: IMG.dress, qty: 15, price: 80000 },
      { name: "Bolalar sharfi", image: IMG.scarf, qty: 30, price: 18000 },
    ],
    amount: 1740000,
    payment: "Karta",
    status: "tasdiqlangan",
  },
  {
    id: 10179,
    number: "SD-10179",
    date: "2026-08-15",
    customer: "Bekzod Aliyev",
    phone: "+998 97 333 44 55",
    items: [{ name: "Bolalar krasovkasi", image: IMG.sneakers, qty: 30, price: 90000 }],
    amount: 2700000,
    payment: "Karta",
    status: "jonatildi",
  },
  {
    id: 10178,
    number: "SD-10178",
    date: "2026-08-14",
    customer: "Zilola Karimova",
    phone: "+998 95 555 66 77",
    items: [
      { name: "Bolalar paltosi", image: IMG.coat, qty: 10, price: 140000 },
      { name: "Bolalar svitcheri", image: IMG.hoodie, qty: 20, price: 55000 },
    ],
    amount: 2500000,
    payment: "Naqd",
    status: "yetkazildi",
  },
  {
    id: 10177,
    number: "SD-10177",
    date: "2026-08-12",
    customer: "Jasur Nazarov",
    phone: "+998 88 777 88 99",
    items: [{ name: "Bolalar futbolkasi Premium", image: IMG.shirt, qty: 60, price: 25000 }],
    amount: 1500000,
    payment: "Karta",
    status: "bekor_qilindi",
  },
  {
    id: 10176,
    number: "SD-10176",
    date: "2026-08-11",
    customer: "Dilnoza Ismoilova",
    phone: "+998 99 999 00 11",
    items: [{ name: "Bolalar jinsi shim", image: IMG.jeans, qty: 35, price: 45000 }],
    amount: 1575000,
    payment: "Karta",
    status: "yetkazildi",
  },
  {
    id: 10175,
    number: "SD-10175",
    date: "2026-08-09",
    customer: "Otabek Ergashev",
    phone: "+998 90 222 33 44",
    items: [
      { name: "Bolalar ko'ylagi (qizlar)", image: IMG.dress, qty: 20, price: 80000 },
      { name: "Bolalar sharfi", image: IMG.scarf, qty: 40, price: 18000 },
    ],
    amount: 2320000,
    payment: "Naqd",
    status: "tayyorlanmoqda",
  },
  {
    id: 10174,
    number: "SD-10174",
    date: "2026-08-07",
    customer: "Nilufar Rahimova",
    phone: "+998 91 234 56 78",
    items: [{ name: "Bolalar qishki ko'ylagi", image: IMG.jacket, qty: 12, price: 120000 }],
    amount: 1440000,
    payment: "Karta",
    status: "yetkazildi",
  },
  {
    id: 10173,
    number: "SD-10173",
    date: "2026-08-05",
    customer: "Madina Yusupova",
    phone: "+998 90 111 22 33",
    items: [{ name: "Bolalar svitcheri", image: IMG.hoodie, qty: 45, price: 55000 }],
    amount: 2475000,
    payment: "Karta",
    status: "yetkazildi",
  },
  {
    id: 10172,
    number: "SD-10172",
    date: "2026-08-03",
    customer: "Sardor To'rayev",
    phone: "+998 93 456 78 90",
    items: [{ name: "Bolalar paltosi", image: IMG.coat, qty: 8, price: 140000 }],
    amount: 1120000,
    payment: "Naqd",
    status: "bekor_qilindi",
  },
  {
    id: 10171,
    number: "SD-10171",
    date: "2026-08-01",
    customer: "Bekzod Aliyev",
    phone: "+998 97 333 44 55",
    items: [
      { name: "Bolalar futbolkasi Premium", image: IMG.shirt, qty: 30, price: 25000 },
      { name: "Bolalar jinsi shim", image: IMG.jeans, qty: 15, price: 45000 },
    ],
    amount: 1425000,
    payment: "Karta",
    status: "yetkazildi",
  },
];

/* =========================================================
   CUSTOMERS
========================================================= */

const CUSTOMERS = [
  { id: 1, name: "Nilufar Rahimova", phone: "+998 91 234 56 78", initials: "NR", orders: 24, spending: 38400000, lastOrder: "2026-08-18", status: "faol" },
  { id: 2, name: "Sardor To'rayev", phone: "+998 93 456 78 90", initials: "ST", orders: 18, spending: 27600000, lastOrder: "2026-08-17", status: "faol" },
  { id: 3, name: "Madina Yusupova", phone: "+998 90 111 22 33", initials: "MY", orders: 15, spending: 19800000, lastOrder: "2026-08-16", status: "faol" },
  { id: 4, name: "Bekzod Aliyev", phone: "+998 97 333 44 55", initials: "BA", orders: 11, spending: 15200000, lastOrder: "2026-08-15", status: "faol" },
  { id: 5, name: "Zilola Karimova", phone: "+998 95 555 66 77", initials: "ZK", orders: 9, spending: 11400000, lastOrder: "2026-08-14", status: "yangi" },
  { id: 6, name: "Jasur Nazarov", phone: "+998 88 777 88 99", initials: "JN", orders: 6, spending: 7200000, lastOrder: "2026-08-12", status: "yangi" },
  { id: 7, name: "Dilnoza Ismoilova", phone: "+998 99 999 00 11", initials: "DI", orders: 5, spending: 6300000, lastOrder: "2026-08-11", status: "faol" },
  { id: 8, name: "Otabek Ergashev", phone: "+998 90 222 33 44", initials: "OE", orders: 3, spending: 4200000, lastOrder: "2026-08-09", status: "yangi" },
  { id: 9, name: "Gulbahor Toshmatova", phone: "+998 94 888 11 22", initials: "GT", orders: 2, spending: 1800000, lastOrder: "2026-07-28", status: "bloklangan" },
  { id: 10, name: "Aziz Rahimov", phone: "+998 90 444 55 66", initials: "AR", orders: 1, spending: 900000, lastOrder: "2026-07-21", status: "yangi" },
];

/* =========================================================
   TRANSACTIONS
========================================================= */

const TRANSACTIONS = [
  { id: 8801, date: "2026-08-18", type: "sotuv", title: "Buyurtma to'lovi (SD-10182)", amount: 1900000, status: "muvaffaqiyatli" },
  { id: 8800, date: "2026-08-17", type: "sotuv", title: "Buyurtma to'lovi (SD-10181)", amount: 3000000, status: "muvaffaqiyatli" },
  { id: 8799, date: "2026-08-16", type: "sotuv", title: "Buyurtma to'lovi (SD-10180)", amount: 1740000, status: "muvaffaqiyatli" },
  { id: 8798, date: "2026-08-15", type: "yechib_olish", title: "Bank kartaga yechib olish", amount: -5000000, status: "muvaffaqiyatli" },
  { id: 8797, date: "2026-08-14", type: "sotuv", title: "Buyurtma to'lovi (SD-10178)", amount: 2500000, status: "kutilmoqda" },
  { id: 8796, date: "2026-08-12", type: "qaytarish", title: "Bekor qilingan buyurtma (SD-10177)", amount: -1500000, status: "bekor" },
  { id: 8795, date: "2026-08-11", type: "sotuv", title: "Buyurtma to'lovi (SD-10176)", amount: 1575000, status: "muvaffaqiyatli" },
  { id: 8794, date: "2026-08-09", type: "sotuv", title: "Buyurtma to'lovi (SD-10175)", amount: 2320000, status: "muvaffaqiyatli" },
  { id: 8793, date: "2026-08-05", type: "sotuv", title: "Buyurtma to'lovi (SD-10173)", amount: 2475000, status: "muvaffaqiyatli" },
];

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
  { id: 1, name: "Bolalar kiyimlari", slug: "bolalar-kiyimlari", count: 4, status: "active" },
  { id: 2, name: "Poyabzallar", slug: "poyabzallar", count: 1, status: "active" },
  { id: 3, name: "Aksessuarlar", slug: "aksesuarlar", count: 1, status: "active" },
  { id: 4, name: "O'yinchoqlar", slug: "oyinchoqlar", count: 0, status: "draft" },
];

/* =========================================================
   DISCOUNTS
========================================================= */

const DISCOUNTS = [
  { id: 1, name: "Yozgi chegirma", type: "foiz", value: 10, appliesTo: "Barcha mahsulotlar", endDate: "2026-08-31", status: "active" },
  { id: 2, name: "Ulgurji maxsus", type: "foiz", value: 15, appliesTo: "Bolalar krasovkasi", endDate: "2026-09-15", status: "active" },
  { id: 3, name: "Kuz mavsumi aksiyasi", type: "miqdor", value: 20000, appliesTo: "Bolalar qishki ko'ylagi", endDate: "2026-09-30", status: "paused" },
  { id: 4, name: "Yangi mijozlar uchun", type: "foiz", value: 5, appliesTo: "Birinchi buyurtma", endDate: "2026-10-01", status: "active" },
];

/* =========================================================
   NOTIFICATIONS
========================================================= */

const NOTIFICATIONS_DEFAULT = [
  { id: 1, type: "order", title: "Yangi buyurtma", text: "SD-10182 buyurtmasi qabul qilindi. 1.900.000 so'm.", time: "5 daqiqa oldin", read: false },
  { id: 2, type: "payment", title: "To'lov qabul qilindi", text: "SD-10181 buyurtmasi uchun 3.000.000 so'm to'landi.", time: "1 soat oldin", read: false },
  { id: 3, type: "stock", title: "Mahsulot tugamoqda", text: "Bolalar svitcheri (BSV-004) omborda tugagan.", time: "3 soat oldin", read: false },
  { id: 4, type: "message", title: "Mijoz xabari", text: "Nilufar Rahimova sizga xabar yubordi.", time: "4 soat oldin", read: false },
  { id: 5, type: "approve", title: "Mahsulot tasdiqlandi", text: "Bolalar paltosi mahsulotingiz platformada e'lon qilindi.", time: "Kecha", read: false },
  { id: 6, type: "reject", title: "Mahsulot rad etildi", text: "Bolalar krasovkasi tasvirlari talabga mos emas. Yangilang.", time: "2 kun oldin", read: true },
  { id: 7, type: "system", title: "Tizim yangilanishi", text: "Dukoni platformasi yangi versiyaga yangilandi.", time: "1 hafta oldin", read: true },
];

/* =========================================================
   CONVERSATIONS
========================================================= */

const CONVERSATIONS = [
  {
    id: 1,
    name: "Nilufar Rahimova",
    phone: "+998 91 234 56 78",
    initials: "NR",
    online: true,
    role: "Mijoz",
    orders: 24,
    unread: 2,
    messages: [
      { id: 1, from: "them", text: "Assalomu alaykum! Futbolkalar 40 dona yetib bormi?", time: "10:12" },
      { id: 2, from: "me", text: "Va alaykum assalom! Ha, omborda 320 dona bor.", time: "10:15" },
      { id: 3, from: "them", text: "Ajoyib. Buyurtmani bugun jo'natib bera olasizmi?", time: "10:16" },
    ],
  },
  {
    id: 2,
    name: "Sardor To'rayev",
    phone: "+998 93 456 78 90",
    initials: "ST",
    online: true,
    role: "Mijoz",
    orders: 18,
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "Qishki ko'ylaklar uchun ulgurji narxda yana chegirma bormi?", time: "Kecha" },
      { id: 2, from: "me", text: "Hozircha 15% chegirma mavjud.", time: "Kecha" },
    ],
  },
  {
    id: 3,
    name: "Madina Yusupova",
    phone: "+998 90 111 22 33",
    initials: "MY",
    online: false,
    role: "Mijoz",
    orders: 15,
    unread: 0,
    messages: [
      { id: 1, from: "me", text: "Salom! Siz uchun yangi to'plam keldi.", time: "2 kun oldin" },
      { id: 2, from: "them", text: "Qiziqarli, fotoalbomni yuboring.", time: "2 kun oldin" },
    ],
  },
  {
    id: 4,
    name: "Bekzod Aliyev",
    phone: "+998 97 333 44 55",
    initials: "BA",
    online: false,
    role: "Mijoz",
    orders: 11,
    unread: 1,
    messages: [
      { id: 1, from: "them", text: "Krasovkalar o'lchami 30 bormi?", time: "3 kun oldin" },
    ],
  },
];

/* =========================================================
   ANALYTICS DATA
========================================================= */

const ANALYTICS = {
  bugun: {
    labels: ["00", "04", "08", "12", "16", "20", "24"],
    revenue: [0, 0, 380000, 850000, 1400000, 2100000, 2400000],
    orders: [0, 0, 2, 5, 8, 11, 12],
    sold: [0, 0, 40, 120, 210, 300, 340],
  },
  "7kun": {
    labels: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
    revenue: [1250000, 2400000, 1850000, 3150000, 2700000, 4200000, 4850000],
    orders: [6, 11, 9, 14, 13, 21, 24],
    sold: [160, 300, 240, 410, 360, 580, 640],
  },
  "30kun": {
    labels: ["1-hafta", "2-hafta", "3-hafta", "4-hafta"],
    revenue: [9200000, 12500000, 14800000, 17200000],
    orders: [42, 58, 66, 79],
    sold: [1200, 1650, 1900, 2250],
  },
  "1yil": {
    labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg"],
    revenue: [24500000, 18200000, 26800000, 22100000, 31500000, 27400000, 33800000, 39700000],
    orders: [118, 96, 132, 109, 148, 127, 156, 181],
    sold: [3400, 2800, 3900, 3200, 4500, 3700, 4800, 5400],
  },
};

/* =========================================================
   PRESENTATIONAL COMPONENTS
========================================================= */

function StatusBadge({ status, meta }) {
  const m = meta[status] || meta.yangi || meta.sotuv;
  const Icon = m.icon;
  return (
    <span className={"sd-badge sd-badge-" + m.tone}>
      {Icon && <Icon />}
      {m.label}
    </span>
  );
}

function ProductBadge({ status }) {
  const m = PRODUCT_STATUS[status] || PRODUCT_STATUS.draft;
  return <span className={"sd-badge sd-badge-" + m.tone}>{m.label}</span>;
}

function Skeleton({ className = "", style = {} }) {
  return <span className={"sd-skeleton " + className} style={style} aria-hidden="true" />;
}

function EmptyState({ icon, title, text, action }) {
  return (
    <div className="sd-empty">
      <div className="sd-empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

function ErrorState({ title = "Xatolik yuz berdi", text = "Ma'lumotlarni yuklashda muammo bo'ldi. Qaytadan urinib ko'ring.", onRetry }) {
  return (
    <div className="sd-empty sd-error">
      <div className="sd-empty-icon sd-empty-error"><FaExclamationTriangle /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      {onRetry && (
        <button className="sd-btn sd-btn-primary" onClick={onRetry}>
          <FaSyncAlt /> Qayta urinish
        </button>
      )}
    </div>
  );
}

function ToastStack({ toasts, dismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="sd-toasts" aria-live="polite">
      {toasts.map((toast) => {
        const Icon =
          toast.type === "success"
            ? FaCheckCircle
            : toast.type === "error"
              ? FaExclamationTriangle
              : FaInfoCircle;
        return (
          <div className={"sd-toast sd-toast-" + toast.type} key={toast.id}>
            <span className="sd-toast-icon">
              <Icon />
            </span>
            <div className="sd-toast-body">
              <strong>{toast.title}</strong>
              {toast.message && <p>{toast.message}</p>}
            </div>
            <button
              className="sd-toast-close"
              onClick={() => dismiss(toast.id)}
              aria-label="Yopish"
            >
              <FaTimes />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ConfirmDialog({ data, onCancel, onConfirm }) {
  return (
    <div className="sd-modal" role="dialog" aria-modal="true">
      <div className="sd-modal-backdrop" onClick={onCancel} />
      <div className={"sd-confirm " + (data.danger ? "sd-confirm-danger" : "")}>
        <div className="sd-confirm-icon">
          {data.danger ? <FaExclamationTriangle /> : <FaExclamationCircle />}
        </div>
        <h3>{data.title}</h3>
        <p>{data.text}</p>
        <div className="sd-confirm-actions">
          <button className="sd-btn sd-btn-ghost" onClick={onCancel}>
            Bekor qilish
          </button>
          <button
            className={"sd-btn " + (data.danger ? "sd-btn-danger" : "sd-btn-primary")}
            onClick={onConfirm}
          >
            {data.confirmLabel || "Tasdiqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, size = "" }) {
  return (
    <div className="sd-modal" role="dialog" aria-modal="true">
      <div className="sd-modal-backdrop" onClick={onClose} />
      <div className={"sd-modal-box " + (size ? "sd-modal-" + size : "")}>
        <div className="sd-modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="sd-icon-btn sd-icon-btn-ghost" onClick={onClose} aria-label="Yopish">
            <FaTimes />
          </button>
        </div>
        <div className="sd-modal-body">{children}</div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="sd-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span />
    </label>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="sd-tabs">
      {tabs.map((tab) => (
        <button
          className={"sd-tab " + (active === tab.id ? "sd-tab-active" : "")}
          key={tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.count != null && <span className="sd-tab-count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

function Pagination({ page, total, pageSize, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const shown = [];
  const push = (p) => {
    if (p >= 1 && p <= pages && !shown.includes(p)) shown.push(p);
  };
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) push(p);
  }
  const items = [];
  let prev = 0;
  shown.forEach((p) => {
    if (p - prev > 1) items.push(<span className="sd-page-gap" key={"g" + p}>…</span>);
    items.push(
      <button
        className={"sd-page " + (p === page ? "sd-page-active" : "")}
        key={p}
        onClick={() => onChange(p)}
        disabled={p === page}
      >
        {p}
      </button>
    );
    prev = p;
  });

  return (
    <div className="sd-pagination">
      <button
        className="sd-icon-btn sd-icon-btn-ghost"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Oldingi"
      >
        <FaChevronLeft />
      </button>
      {items}
      <button
        className="sd-icon-btn sd-icon-btn-ghost"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Keyingi"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

function Sparkline({ data, color, strokeWidth = 2, height = 36 }) {
  const width = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = (i * stepX).toFixed(1);
    const y = (height - 4 - ((v - min) / range) * (height - 8)).toFixed(1);
    return x + "," + y;
  });
  return (
    <svg
      className="sd-spark"
      width="100%"
      height={height}
      viewBox={"0 0 " + width + " " + height}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SalesChart({ type, labels, values, color }) {
  const width = 720;
  const height = 270;
  const pad = { t: 24, r: 18, b: 34, l: 56 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const max = Math.max(...values);
  const niceMax = Math.ceil(max / 100000) * 100000;
  const stepX = innerW / (labels.length - 1);
  const y = (v) => pad.t + innerH - (v / niceMax) * innerH;
  const x = (i) => pad.l + i * stepX;

  const linePoints = values.map((v, i) => x(i).toFixed(1) + "," + y(v).toFixed(1)).join(" ");
  const areaPoints = pad.l + "," + (pad.t + innerH) + " " + linePoints + " " + (pad.l + innerW) + "," + (pad.t + innerH);

  const ticks = Array.from({ length: 5 }, (_, i) => niceMax - (niceMax / 4) * i);

  return (
    <div className="sd-chart-box">
      <svg className="sd-chart-svg" viewBox={"0 0 " + width + " " + height} preserveAspectRatio="none" role="img" aria-label="Sotuvlar diagrammasi">
        {ticks.map((tick, i) => {
          const yy = y(tick);
          return (
            <g key={tick}>
              <line x1={pad.l} x2={pad.l + innerW} y1={yy} y2={yy} className="sd-chart-grid" />
              <text x={pad.l - 10} y={yy + 4} textAnchor="end" className="sd-chart-label">
                {formatShortSum(tick)}
              </text>
            </g>
          );
        })}

        {type === "bar" ? (
          <>
            {values.map((v, i) => {
              const barW = Math.max(8, stepX * 0.5);
              const h = (v / niceMax) * innerH;
              return (
                <rect
                  key={labels[i]}
                  x={x(i) - barW / 2}
                  y={pad.t + innerH - h}
                  width={barW}
                  height={h}
                  rx="6"
                  className="sd-chart-bar-rect"
                />
              );
            })}
          </>
        ) : (
          <>
            <polygon points={areaPoints} className="sd-chart-area" />
            <polyline points={linePoints} fill="none" className="sd-chart-line" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            {values.map((v, i) => (
              <circle key={labels[i]} cx={x(i)} cy={y(v)} r="4" className="sd-chart-dot" />
            ))}
          </>
        )}

        {labels.map((label, i) => (
          <text
            key={label}
            x={x(i)}
            y={height - 8}
            textAnchor="middle"
            className="sd-chart-label"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* =========================================================
   FORM FIELD PRIMITIVES
========================================================= */

function Field({ label, hint, children, className = "" }) {
  return (
    <div className={"sd-field " + className}>
      <label>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}

function ChipToggle({ options, value, onChange }) {
  return (
    <div className="sd-chip-group">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            type="button"
            className={"sd-chip-opt " + (active ? "sd-chip-opt-active" : "")}
            key={opt}
            onClick={() =>
              onChange(
                active ? value.filter((v) => v !== opt) : [...value, opt]
              )
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   SELLER DASHBOARD PAGE
========================================================= */

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "Bolalar kiyimlari",
  subcategory: "",
  wholesalePrice: "",
  retailPrice: "",
  discount: 0,
  stock: "",
  minOrder: 10,
  sizes: [],
  colors: [],
  variants: [],
  sku: "",
  status: "draft",
  ageGroup: "Bolalar (2-10)",
  gender: "Unisex",
  material: "",
  season: "Barcha mavsum",
  images: [],
};

const SIZE_OPTIONS = {
  "Bolalar kiyimlari": ["2-3", "3-4", "5-6", "7-8", "9-10", "11-12"],
  Poyabzallar: ["24", "25", "26", "27", "28", "29", "30", "31"],
  Aksessuarlar: ["Yagona"],
};

const COLOR_OPTIONS = [
  "Oq", "Qora", "Ko'k", "To'q ko'k", "Qizil", "Pushti",
  "Sariq", "Yashil", "Kulrang", "Jigarrang", "Binafsha", "To'q sariq",
];

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [section, setSection] = useState("dashboard");
  const [dark, setDark] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [drawer, setDrawer] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [online, setOnline] = useState(true);
  const [headerQuery, setHeaderQuery] = useState("");

  /* ---- products ---- */
  const [products, setProducts] = useState(PRODUCTS);
  const [productView, setProductView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [productQuery, setProductQuery] = useState("");
  const [productCat, setProductCat] = useState("all");
  const [productStatus, setProductStatus] = useState("all");
  const [productSort, setProductSort] = useState("sales");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const [form, setForm] = useState({ ...EMPTY_FORM, images: [] });
  const [formSaving, setFormSaving] = useState(false);

  /* ---- orders ---- */
  const [orders, setOrders] = useState(ORDERS);
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [orderDetail, setOrderDetail] = useState(null);

  /* ---- sales / analytics ---- */
  const [analyticsRange, setAnalyticsRange] = useState("7kun");
  const [analyticsMetric, setAnalyticsMetric] = useState("revenue");
  const [chartType, setChartType] = useState("line");

  /* ---- customers ---- */
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerStatus, setCustomerStatus] = useState("all");
  const [customerPage, setCustomerPage] = useState(1);
  const [customerDetail, setCustomerDetail] = useState(null);

  /* ---- inventory ---- */
  const [lowStockFilter, setLowStockFilter] = useState("all");

  /* ---- categories ---- */
  const [categories, setCategories] = useState(CATEGORIES);
  const [catModal, setCatModal] = useState(null);

  /* ---- discounts ---- */
  const [discounts, setDiscounts] = useState(DISCOUNTS);
  const [discountModal, setDiscountModal] = useState(null);

  /* ---- payments ---- */
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  /* ---- reports ---- */
  const [reportTab, setReportTab] = useState("sales");
  const [reportRange, setReportRange] = useState("monthly");

  /* ---- notifications ---- */
  const [notifications, setNotifications] = useState(() =>
    loadJSON(NOTIF_KEY, NOTIFICATIONS_DEFAULT)
  );
  const [notifFilter, setNotifFilter] = useState("all");
  const filteredNotifications = useMemo(() => {
    if (notifFilter === "all") return notifications;
    if (notifFilter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === notifFilter);
  }, [notifications, notifFilter]);

  /* ---- messages ---- */
  const [messages, setMessages] = useState(CONVERSATIONS);
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0].id);
  const [chatDraft, setChatDraft] = useState("");
  const chatEndRef = useRef(null);

  /* ---- store ---- */
  const [store, setStore] = useState({
    name: SELLER.shop,
    description: SELLER.bio,
    phone: SELLER.phone,
    address: SELLER.address,
    openTime: "09:00",
    closeTime: "18:00",
    days: ["Du", "Se", "Ch", "Pa", "Ju", "Sh"],
    instagram: "abusahiy_g118",
    telegram: "abusahiy_g118",
    facebook: "",
    delivery: "O'zbekiston bo'ylab yetkazib beramiz. Buyurtma 24 soat ichida jo'natiladi.",
    freeDeliveryFrom: 2000000,
  });
  const [storeTab, setStoreTab] = useState("edit");

  /* ---- settings ---- */
  const [settingsTab, setSettingsTab] = useState("account");
  const [settings, setSettings] = useState({
    name: SELLER.name,
    email: SELLER.email,
    phone: SELLER.phone,
    twoFactor: true,
    notifOrder: true,
    notifPayment: true,
    notifStock: false,
    notifMessages: true,
    notifNews: false,
    language: localStorage.getItem("language") || "uz",
    currency: "UZS",
    privatePhone: false,
    showStats: true,
  });

  const [profileTab, setProfileTab] = useState("overview");

  /* =========================
     EFFECTS
  ========================= */

  useEffect(() => {
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, messages]);

  useEffect(() => {
    saveJSON(NOTIF_KEY, notifications);
  }, [notifications]);

  /* =========================
     DERIVED DATA
  ========================= */

  const unreadCount = notifications.filter((item) => !item.read).length;
  const unreadChats = messages.reduce((sum, conv) => sum + conv.unread, 0);
  const newOrders = orders.filter((o) => o.status === "yangi").length;

  const stats = {
    todaySales: 4850000,
    totalOrders: 156,
    newOrders,
    totalProducts: products.length + 320,
    totalCustomers: 1240,
    revenue: 48500000,
  };

  const inventoryStats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const low = products.filter((p) => p.stock > 0 && p.stock <= 20);
    const out = products.filter((p) => p.stock === 0);
    return { totalStock, low, out };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      const matchCat = productCat === "all" || p.category === productCat;
      const matchStatus = productStatus === "all" || p.status === productStatus;
      return matchQ && matchCat && matchStatus;
    });
    if (productSort === "sales") list = [...list].sort((a, b) => b.sales - a.sales);
    if (productSort === "price-desc") list = [...list].sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    if (productSort === "price-asc") list = [...list].sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    if (productSort === "stock") list = [...list].sort((a, b) => a.stock - b.stock);
    if (productSort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (productSort === "newest") list = [...list].sort((a, b) => b.id - a.id);
    return list;
  }, [products, productQuery, productCat, productStatus, productSort]);

  const filteredOrders = useMemo(() => {
    const q = orderQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchQ =
        !q ||
        order.number.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q);
      const matchStatus =
        orderStatus === "all" || order.status === orderStatus;
      return matchQ && matchStatus;
    });
  }, [orders, orderQuery, orderStatus]);

  const filteredCustomers = useMemo(() => {
    const q = customerQuery.trim().toLowerCase();
    return CUSTOMERS.filter((c) => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
      const matchStatus = customerStatus === "all" || c.status === customerStatus;
      return matchQ && matchStatus;
    });
  }, [customerQuery, customerStatus]);

  const headerResults = useMemo(() => {
    const q = headerQuery.trim().toLowerCase();
    if (!q) return [];
    const orderHits = orders
      .filter(
        (o) =>
          o.number.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((o) => ({ kind: "order", ...o }));
    const productHits = products
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({ kind: "product", ...p }));
    return [...orderHits, ...productHits];
  }, [headerQuery, orders, products]);

  const recentOrders = [...orders]
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);

  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);

  /* =========================
     ACTIONS
  ========================= */

  function pushToast(type, title, message) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function askConfirm(config) {
    setConfirm(config);
  }

  function go(nextSection) {
    setSection(nextSection);
    setDrawer(false);
    setProfileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleDark() {
    setDark((prev) => !prev);
  }

  /* ---- product actions ---- */

  function openAddProduct() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, images: [] });
    setProductView("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEditProduct(product) {
    setEditingId(product.id);
    setForm({
      ...EMPTY_FORM,
      ...product,
      wholesalePrice: String(product.wholesalePrice),
      retailPrice: String(product.retailPrice),
      stock: String(product.stock),
      discount: product.discount || 0,
      minOrder: product.minOrder || 10,
      images: product.image ? [{ id: product.id, url: product.image }] : [],
    });
    setProductView("edit");
    setSection("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setProductView("list");
    setEditingId(null);
  }

  function saveProduct(status) {
    if (!form.name.trim()) {
      pushToast("error", "Xatolik", "Mahsulot nomini kiriting");
      return;
    }
    if (!form.wholesalePrice || !form.retailPrice) {
      pushToast("error", "Xatolik", "Ulgurji va chakana narxlarni kiriting");
      return;
    }
    setFormSaving(true);
    setTimeout(() => {
      const payload = {
        ...form,
        name: form.name.trim(),
        wholesalePrice: Number(form.wholesalePrice),
        retailPrice: Number(form.retailPrice),
        stock: Number(form.stock || 0),
        minOrder: Number(form.minOrder || 1),
        status,
        image: form.images[0]?.url || IMG.shirt,
      };

      if (editingId != null) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...payload, id: p.id } : p))
        );
        pushToast("success", "Mahsulot yangilandi", payload.name);
      } else {
        setProducts((prev) => [
          { ...payload, id: Date.now(), sales: 0 },
          ...prev,
        ]);
        pushToast(
          status === "active" ? "success" : "info",
          status === "active" ? "Mahsulot e'lon qilindi" : "Mahsulot qoralamaga saqlandi",
          payload.name
        );
      }
      setFormSaving(false);
      setProductView("list");
      setEditingId(null);
    }, 900);
  }

  function deleteProduct(product) {
    askConfirm({
      danger: true,
      title: "Mahsulotni o'chirish",
      text: '"' + product.name + '" mahsulotini o\'chirmoqchimisiz? Bu amalni ortga qaytarib bo\'lmaydi.',
      confirmLabel: "O'chirish",
      action: () => {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        setSelectedProducts((prev) => prev.filter((id) => id !== product.id));
        pushToast("success", "Mahsulot o'chirildi", product.name);
      },
    });
  }

  function bulkDeleteProducts() {
    askConfirm({
      danger: true,
      title: "Tanlangan mahsulotlarni o'chirish",
      text: selectedProducts.length + " ta mahsulotni o'chirmoqchimisiz?",
      confirmLabel: "O'chirish",
      action: () => {
        setProducts((prev) =>
          prev.filter((p) => !selectedProducts.includes(p.id))
        );
        setSelectedProducts([]);
        pushToast("success", "O'chirildi", selectedProducts.length + " ta mahsulot o'chirildi");
      },
    });
  }

  function bulkSetStatus(status) {
    setProducts((prev) =>
      prev.map((p) =>
        selectedProducts.includes(p.id) ? { ...p, status } : p
      )
    );
    pushToast("success", "Status yangilandi", selectedProducts.length + " ta mahsulot");
    setSelectedProducts([]);
  }

  function toggleSelectProduct(id) {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  /* ---- order actions ---- */

  const NEXT_ORDER_STATUS = {
    yangi: "tasdiqlangan",
    tasdiqlangan: "tayyorlanmoqda",
    tayyorlanmoqda: "jonatildi",
    jonatildi: "yetkazildi",
  };

  function acceptOrder(order) {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "tasdiqlangan" } : o))
    );
    pushToast("success", "Buyurtma tasdiqlandi", order.number);
  }

  function cancelOrder(order) {
    askConfirm({
      danger: true,
      title: "Buyurtmani bekor qilish",
      text: order.number + " buyurtmasini bekor qilmoqchimisiz?",
      confirmLabel: "Bekor qilish",
      action: () => {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: "bekor_qilindi" } : o))
        );
        pushToast("success", "Buyurtma bekor qilindi", order.number);
      },
    });
  }

  function advanceOrder(order) {
    const next = NEXT_ORDER_STATUS[order.status];
    if (!next) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    );
    pushToast("info", "Holat yangilandi", ORDER_STATUS[next].label);
  }

  function printInvoice(order) {
    pushToast("info", "Hisob-faktura", order.number + " hisob-fakturasi chop etishga yuborildi");
  }

  /* ---- withdraw ---- */

  function handleWithdraw() {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      pushToast("error", "Xatolik", "Yechib olish summasini kiriting");
      return;
    }
    if (amount > SELLER.balance) {
      pushToast("error", "Xatolik", "Balansingizda yetarli mablag' yo'q");
      return;
    }
    setTransactions((prev) => [
      {
        id: Date.now(),
        date: "2026-08-18",
        type: "yechib_olish",
        title: "Bank kartaga yechib olish",
        amount: -amount,
        status: "kutilmoqda",
      },
      ...prev,
    ]);
    setWithdrawAmount("");
    setWithdrawOpen(false);
    pushToast("success", "So'rov yuborildi", formatSum(amount) + " yechib olish kutilmoqda");
  }

  /* ---- messages ---- */

  function sendMessage() {
    const text = chatDraft.trim();
    if (!text) return;
    setMessages((prev) =>
      prev.map((conv) =>
        conv.id === activeChat
          ? {
              ...conv,
              unread: 0,
              messages: [
                ...conv.messages,
                { id: Date.now(), from: "me", text, time: "Hozir" },
              ],
            }
          : conv
      )
    );
    setChatDraft("");
  }

  function sendChatImage() {
    pushToast("info", "Rasm yuklash", "Tasvirni tanlash oynasi ochiladi");
  }

  /* ---- notifications ---- */

  function markAllRead() {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    pushToast("success", "Barcha bildirishnomalar o'qildi");
  }

  function markRead(id) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }

  function removeNotification(id) {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }

  /* ---- misc ---- */

  function handleLogout() {
    askConfirm({
      danger: true,
      title: "Tizimdan chiqish",
      text: "Sotuvchi hisobingizdan chiqmoqchimisiz?",
      confirmLabel: "Chiqish",
      action: () => navigate("/"),
    });
  }

  function handleSettingsSave() {
    pushToast("success", "Sozlamalar saqlandi");
  }

  function handleStoreSave() {
    pushToast("success", "Do'kon ma'lumotlari saqlandi");
  }

  function exportReport(type) {
    const label =
      type === "pdf" ? "PDF" : type === "excel" ? "Excel" : "CSV";
    pushToast(
      "success",
      label + " eksport qilindi",
      "Hisobot fayli yuklab olish uchun tayyor"
    );
  }

  function openCustomer(customer) {
    setCustomerDetail(customer);
  }

  /* =========================
     NAV
  ========================= */

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: <FaColumns />, group: "asosiy" },
    { id: "products", label: "Mahsulotlar", icon: <FaTshirt />, group: "dokon" },
    { id: "orders", label: "Buyurtmalar", icon: <FaBoxOpen />, group: "savdo" },
    { id: "sales", label: "Sotuvlar", icon: <FaChartLine />, group: "savdo" },
    { id: "customers", label: "Mijozlar", icon: <FaUsers />, group: "savdo" },
    { id: "inventory", label: "Ombor", icon: <FaBoxes />, group: "dokon" },
    { id: "categories", label: "Kategoriyalar", icon: <FaTags />, group: "dokon" },
    { id: "discounts", label: "Chegirmalar", icon: <FaPercentage />, group: "dokon" },
    { id: "payments", label: "To'lovlar", icon: <FaWallet />, group: "moliyaviy" },
    { id: "reports", label: "Hisobotlar", icon: <FaFileAlt />, group: "moliyaviy" },
    { id: "messages", label: "Xabarlar", icon: <FaEnvelope />, group: "aloqa" },
    { id: "notifications", label: "Bildirishnomalar", icon: <FaBell />, group: "aloqa" },
    { id: "store", label: "Do'konim", icon: <FaStore />, group: "hisob" },
    { id: "profile", label: "Profil", icon: <FaUser />, group: "hisob" },
    { id: "settings", label: "Sozlamalar", icon: <FaCog />, group: "hisob" },
  ];

  const NAV_GROUPS = [
    { id: "asosiy", label: "Asosiy" },
    { id: "dokon", label: "Do'kon boshqaruvi" },
    { id: "savdo", label: "Savdo va mijozlar" },
    { id: "moliyaviy", label: "Moliyaviy" },
    { id: "aloqa", label: "Aloqa" },
    { id: "hisob", label: "Hisob" },
  ];

  const sectionTitle =
    NAV.find((item) => item.id === section)?.label || "Dashboard";

  function navBadge(itemId) {
    if (itemId === "orders") return newOrders;
    if (itemId === "notifications") return unreadCount;
    if (itemId === "messages") return unreadChats;
    if (itemId === "inventory") return inventoryStats.low.length;
    return 0;
  }

  /* =========================================================
     SECTIONS
  ========================================================= */

  /* =========================
     DASHBOARD
  ========================= */

  function renderDashboard() {
    const statCards = [
      {
        label: "Bugungi sotuvlar",
        value: formatSum(stats.todaySales),
        icon: <FaMoneyBillWave />,
        tone: "primary",
        trend: "+12.5%",
        up: true,
        compare: "Kechagi kunga nisbatan",
        spark: [18, 24, 21, 30, 27, 38, 42, 45],
      },
      {
        label: "Jami buyurtmalar",
        value: stats.totalOrders,
        icon: <FaBoxOpen />,
        tone: "purple",
        trend: "+8.2%",
        up: true,
        compare: "Bu oy",
        spark: [10, 14, 12, 18, 16, 22, 20, 26],
      },
      {
        label: "Yangi buyurtmalar",
        value: stats.newOrders,
        icon: <FaShoppingBag />,
        tone: "warning",
        trend: "+3",
        up: true,
        compare: "Bugun",
        spark: [4, 2, 6, 3, 8, 5, 9, 12],
      },
      {
        label: "Jami mahsulotlar",
        value: stats.totalProducts,
        icon: <FaTshirt />,
        tone: "info",
        trend: "+14",
        up: true,
        compare: "Bu oy",
        spark: [30, 32, 31, 34, 33, 36, 35, 38],
      },
      {
        label: "Mijozlar",
        value: stats.totalCustomers,
        icon: <FaUsers />,
        tone: "success",
        trend: "+5.4%",
        up: true,
        compare: "O'tgan oyga nisbatan",
        spark: [20, 22, 21, 24, 26, 25, 28, 30],
      },
      {
        label: "Daromad",
        value: formatSum(stats.revenue),
        icon: <FaWallet />,
        tone: "danger",
        trend: "+18.3%",
        up: true,
        compare: "O'tgan oyga nisbatan",
        spark: [12, 18, 15, 24, 20, 30, 26, 36],
      },
    ];

    const quickActions = [
      { label: "Yangi mahsulot", icon: <FaPlus />, target: "products", tint: "primary", onGo: () => { setProductView("list"); openAddProduct(); } },
      { label: "Buyurtmalar", icon: <FaBoxOpen />, target: "orders", tint: "purple" },
      { label: "To'lovlar", icon: <FaWallet />, target: "payments", tint: "success" },
      { label: "Hisobotlar", icon: <FaFileAlt />, target: "reports", tint: "warning" },
    ];

    const rangeTabs = [
      { id: "bugun", label: "Bugun" },
      { id: "7kun", label: "7 kun" },
      { id: "30kun", label: "30 kun" },
      { id: "1yil", label: "1 yil" },
    ];

    const metricTabs = [
      { id: "revenue", label: "Daromad" },
      { id: "orders", label: "Buyurtmalar" },
      { id: "sold", label: "Sotilgan" },
    ];

    const activeAnalytics = ANALYTICS[analyticsRange];
    const chartValues = activeAnalytics[analyticsMetric];
    const chartColor =
      analyticsMetric === "revenue" ? "var(--sd-primary)" : analyticsMetric === "orders" ? "var(--sd-purple)" : "var(--sd-warning)";
    const totalValue = chartValues.reduce((a, b) => a + b, 0);

    return (
      <div className="sd-section sd-dashboard">
        <div className="sd-greet">
          <div>
            <h1>Xush kelibsiz, {SELLER.firstName}!</h1>
            <p>
              Bugun — 18.08.2026. Do'koningiz bo'yicha so'nggi faoliyatni ko'rib chiqing.
            </p>
          </div>
          <div className="sd-greet-actions">
            <span className={"sd-online-chip " + (online ? "sd-online-chip-on" : "")}>
              <i /> {online ? "Onlayn" : "Oflayn"}
            </span>
            <Link to="/shop" className="sd-btn sd-btn-ghost sd-btn-sm">
              Do'konni ko'rish <FaExternalLinkAlt />
            </Link>
          </div>
        </div>

        <div className="sd-stats">
          {statCards.map((card) => (
            <div className="sd-stat" key={card.label}>
              <span className={"sd-stat-icon sd-stat-" + card.tone}>{card.icon}</span>
              <div className="sd-stat-info">
                <span className="sd-stat-label">{card.label}</span>
                <strong>{card.value}</strong>
                <span className={"sd-stat-trend " + (card.up ? "sd-trend-up" : "sd-trend-down")}>
                  {card.up ? "▲" : "▼"} {card.trend}
                  <em>{card.compare}</em>
                </span>
              </div>
              <div className="sd-stat-spark">
                <Sparkline
                  data={card.spark}
                  color={chartColor}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="sd-dash-grid">
          <div className="sd-card sd-card-analytics">
            <div className="sd-card-head">
              <div>
                <h2>Sotuvlar tahlili</h2>
                <p>Daromad va buyurtmalar dinamikasi</p>
              </div>
              <div className="sd-chart-type-toggle">
                <button
                  className={chartType === "line" ? "sd-chart-type-active" : ""}
                  onClick={() => setChartType("line")}
                  title="Chiziqli"
                >
                  <FaChartLine />
                </button>
                <button
                  className={chartType === "bar" ? "sd-chart-type-active" : ""}
                  onClick={() => setChartType("bar")}
                  title="Ustunli"
                >
                  <FaChartBar />
                </button>
              </div>
            </div>

            <div className="sd-analytics-controls">
              <Tabs tabs={rangeTabs} active={analyticsRange} onChange={setAnalyticsRange} />
              <div className="sd-analytics-metrics">
                {metricTabs.map((metric) => (
                  <button
                    className={"sd-metric-chip " + (analyticsMetric === metric.id ? "sd-metric-chip-active" : "")}
                    key={metric.id}
                    onClick={() => setAnalyticsMetric(metric.id)}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sd-analytics-summary">
              <div>
                <small>Jami {activeAnalytics.labels.length === 4 ? "oylik" : activeAnalytics.labels.length === 8 ? "yillik" : activeAnalytics.labels.length === 7 ? "haftalik" : "kunlik"} davr</small>
                <strong>{formatSum(totalValue)}</strong>
              </div>
              <div>
                <small>Buyurtmalar</small>
                <strong>{activeAnalytics.orders.reduce((a, b) => a + b, 0)} ta</strong>
              </div>
              <div>
                <small>Sotilgan mahsulot</small>
                <strong>{activeAnalytics.sold.reduce((a, b) => a + b, 0)} dona</strong>
              </div>
            </div>

            <SalesChart
              type={chartType}
              labels={activeAnalytics.labels}
              values={chartValues}
              color={chartColor}
            />
          </div>

          <div className="sd-side-col">
            <div className="sd-card">
              <div className="sd-card-head">
                <div>
                  <h2>Tezkor amallar</h2>
                  <p>Tez-tez ishlatiladigan bo'limlar</p>
                </div>
              </div>
              <div className="sd-quick-actions">
                {quickActions.map((action) => (
                  <button
                    className="sd-quick"
                    key={action.label}
                    onClick={() => {
                      if (action.onGo) action.onGo();
                      else go(action.target);
                    }}
                  >
                    <span className={"sd-quick-icon sd-stat-" + action.tint}>{action.icon}</span>
                    <span>
                      <strong>{action.label}</strong>
                      <small>Bo'limga o'tish</small>
                    </span>
                    <FaChevronRight className="sd-quick-arrow" />
                  </button>
                ))}
              </div>
            </div>

            <div className="sd-card">
              <div className="sd-card-head">
                <div>
                  <h2>Ombor xavf signali</h2>
                  <p>Kamayib borayotgan zaxiralar</p>
                </div>
                <button className="sd-btn sd-btn-ghost sd-btn-sm" onClick={() => go("inventory")}>
                  Barchasi <FaChevronRight />
                </button>
              </div>
              <div className="sd-stock-alerts">
                {inventoryStats.low.length === 0 && (
                  <div className="sd-stock-ok">
                    <FaCheckCircle /> Barcha zaxiralar yetarli
                  </div>
                )}
                {inventoryStats.low.slice(0, 3).map((p) => (
                  <div className="sd-stock-alert" key={p.id}>
                    <img src={p.image} alt={p.name} />
                    <div>
                      <strong>{p.name}</strong>
                      <small>{p.stock} dona qoldi</small>
                    </div>
                    <span className="sd-badge sd-badge-danger">Kam</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sd-card">
              <div className="sd-card-head">
                <div>
                  <h2>Top mahsulotlar</h2>
                  <p>Sotuvlar bo'yicha liderlar</p>
                </div>
              </div>
              <div className="sd-top-products">
                {topProducts.map((p, index) => {
                  const max = topProducts[0].sales;
                  return (
                    <div className="sd-top-product" key={p.id}>
                      <span className="sd-top-rank">{index + 1}</span>
                      <img src={p.image} alt={p.name} />
                      <div className="sd-top-info">
                        <strong>{p.name}</strong>
                        <div className="sd-top-bar">
                          <span style={{ width: (p.sales / max) * 100 + "%" }} />
                        </div>
                      </div>
                      <b>{formatSum(p.wholesalePrice * p.sales)}</b>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="sd-card sd-card-table sd-recent-orders">
          <div className="sd-card-head">
            <div>
              <h2>So'nggi buyurtmalar</h2>
              <p>Oxirgi 6 ta buyurtma</p>
            </div>
            <button className="sd-btn sd-btn-ghost sd-btn-sm" onClick={() => go("orders")}>
              Barchasi <FaChevronRight />
            </button>
          </div>
          <div className="sd-table-wrap">
            <table className="sd-table">
              <thead>
                <tr>
                  <th>Buyurtma ID</th>
                  <th>Mijoz</th>
                  <th>Mahsulot</th>
                  <th>Soni</th>
                  <th>Summa</th>
                  <th>Sana</th>
                  <th>To'lov</th>
                  <th>Holat</th>
                  <th className="sd-ta-right">Amal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <button className="sd-order-id" onClick={() => setOrderDetail(order)}>
                        {order.number}
                      </button>
                    </td>
                    <td>
                      <div className="sd-cell-person">
                        <span className="sd-cell-avatar">{order.customer[0]}</span>
                        <div>
                          <strong>{order.customer}</strong>
                          <small>{order.phone}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="sd-cell-product">
                        <img src={order.items[0].image} alt={order.items[0].name} />
                        <div>
                          <strong>{order.items[0].name}</strong>
                          <small>{order.items.length} ta mahsulot turi</small>
                        </div>
                      </div>
                    </td>
                    <td>{order.items.reduce((s, i) => s + i.qty, 0)} dona</td>
                    <td className="sd-strong">{formatSum(order.amount)}</td>
                    <td className="sd-muted">{formatDate(order.date)}</td>
                    <td className="sd-muted">{order.payment}</td>
                    <td><StatusBadge status={order.status} meta={ORDER_STATUS} /></td>
                    <td className="sd-ta-right">
                      <div className="sd-row-actions">
                        <button className="sd-icon-btn sd-icon-btn-ghost" title="Batafsil" onClick={() => setOrderDetail(order)}>
                          <FaEye />
                        </button>
                        {order.status === "yangi" && (
                          <button className="sd-icon-btn sd-icon-btn-success" title="Qabul qilish" onClick={() => acceptOrder(order)}>
                            <FaCheck />
                          </button>
                        )}
                        <button className="sd-icon-btn sd-icon-btn-danger" title="Bekor qilish" onClick={() => cancelOrder(order)}>
                          <FaTimes />
                        </button>
                        <button className="sd-icon-btn sd-icon-btn-ghost" title="Hisob-faktura" onClick={() => printInvoice(order)}>
                          <FaPrint />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     PRODUCTS
  ========================= */

  function renderProducts() {
    const pageSize = 6;
    const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const page = Math.min(productPage, pageCount);
    const pageItems = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
    const allSelected =
      filteredProducts.length > 0 &&
      filteredProducts.every((p) => selectedProducts.includes(p.id));

    return (
      <div className="sd-section sd-products">
        <div className="sd-section-head">
          <div>
            <h1>Mahsulotlar</h1>
            <p>Jami {products.length} ta mahsulot</p>
          </div>
          <button className="sd-btn sd-btn-primary" onClick={openAddProduct}>
            <FaPlus /> Yangi mahsulot
          </button>
        </div>

        <div className="sd-card sd-filters">
          <div className="sd-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Mahsulot nomi yoki SKU qidirish..."
              value={productQuery}
              onChange={(e) => { setProductQuery(e.target.value); setProductPage(1); }}
            />
            {productQuery && (
              <button onClick={() => setProductQuery("")} aria-label="Tozalash">
                <FaTimes />
              </button>
            )}
          </div>

          <div className="sd-select-box">
            <FaTags />
            <select value={productCat} onChange={(e) => { setProductCat(e.target.value); setProductPage(1); }} aria-label="Kategoriya">
              <option value="all">Barcha kategoriyalar</option>
              {categories.filter((c) => c.status === "active").map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="sd-select-box">
            <FaFilter />
            <select value={productStatus} onChange={(e) => { setProductStatus(e.target.value); setProductPage(1); }} aria-label="Status">
              <option value="all">Barcha statuslar</option>
              <option value="active">Aktiv</option>
              <option value="out_of_stock">Tugagan</option>
              <option value="draft">Qoralama</option>
              <option value="hidden">Yashiringan</option>
            </select>
          </div>

          <div className="sd-select-box">
            <FaSortAmountDown />
            <select value={productSort} onChange={(e) => setProductSort(e.target.value)} aria-label="Saralash">
              <option value="sales">Sotuvlar bo'yicha</option>
              <option value="newest">Eng yangi</option>
              <option value="name">Nomi</option>
              <option value="price-asc">Narx (o'sish)</option>
              <option value="price-desc">Narx (kamayish)</option>
              <option value="stock">Zaxira</option>
            </select>
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="sd-bulk-bar">
            <span>{selectedProducts.length} ta mahsulot tanlangan</span>
            <div>
              <select defaultValue="" onChange={(e) => { if (e.target.value) { bulkSetStatus(e.target.value); e.target.value = ""; } }} aria-label="Status o'zgartirish">
                <option value="" disabled>Status o'zgartirish</option>
                <option value="active">Aktiv</option>
                <option value="hidden">Yashirish</option>
                <option value="draft">Qoralama</option>
              </select>
              <button className="sd-btn sd-btn-danger-soft sd-btn-sm" onClick={bulkDeleteProducts}>
                <FaTrashAlt /> O'chirish
              </button>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="sd-card">
            <EmptyState
              icon={<FaTshirt />}
              title="Mahsulotlar topilmadi"
              text="Qidiruv yoki filtr shartlariga mos mahsulot yo'q. Yangi mahsulot qo'shishingiz mumkin."
              action={
                <button className="sd-btn sd-btn-primary" onClick={openAddProduct}>
                  <FaPlus /> Yangi mahsulot
                </button>
              }
            />
          </div>
        ) : (
          <div className="sd-card sd-card-table">
            <div className="sd-table-wrap">
              <table className="sd-table sd-product-table">
                <thead>
                  <tr>
                    <th className="sd-check-col">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) =>
                          setSelectedProducts(
                            e.target.checked ? filteredProducts.map((p) => p.id) : []
                          )
                        }
                        aria-label="Barchasini tanlash"
                      />
                    </th>
                    <th>Mahsulot</th>
                    <th>Kategoriya</th>
                    <th>Ulgurji narx</th>
                    <th>Chakana narx</th>
                    <th>Zaxira</th>
                    <th>Sotuvlar</th>
                    <th>Status</th>
                    <th className="sd-ta-right">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((product) => (
                    <tr key={product.id}>
                      <td className="sd-check-col">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                          aria-label={product.name + " ni tanlash"}
                        />
                      </td>
                      <td>
                        <div className="sd-cell-product">
                          <img src={product.image} alt={product.name} />
                          <div>
                            <strong>{product.name}</strong>
                            <small>{product.sku}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="sd-cell-cat">{product.category}</span>
                        <small className="sd-block">{product.subcategory}</small>
                      </td>
                      <td className="sd-strong">{formatSum(product.wholesalePrice)}</td>
                      <td className="sd-muted">{formatSum(product.retailPrice)}</td>
                      <td>
                        <span className={product.stock === 0 ? "sd-stock-zero" : product.stock <= 20 ? "sd-stock-low" : ""}>
                          {product.stock} dona
                        </span>
                      </td>
                      <td>{product.sales}</td>
                      <td><ProductBadge status={product.status} /></td>
                      <td className="sd-ta-right">
                        <div className="sd-row-actions">
                          <button className="sd-icon-btn sd-icon-btn-ghost" title="Tahrirlash" onClick={() => openEditProduct(product)}>
                            <FaEdit />
                          </button>
                          <button className="sd-icon-btn sd-icon-btn-danger" title="O'chirish" onClick={() => deleteProduct(product)}>
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sd-table-foot">
              <p>
                {filteredProducts.length} ta mahsulotdan {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filteredProducts.length)} ko'rsatilmoqda
              </p>
              <Pagination page={page} total={filteredProducts.length} pageSize={pageSize} onChange={setProductPage} />
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================
     PRODUCT FORM
  ========================= */

  function renderProductForm() {
    const isEdit = editingId != null;
    const sizeOptions = SIZE_OPTIONS[form.category] || SIZE_OPTIONS["Bolalar kiyimlari"];
    const isClothing = form.category === "Bolalar kiyimlari";

    return (
      <div className="sd-section sd-product-form">
        <div className="sd-section-head">
          <div>
            <button className="sd-back-btn" onClick={cancelForm}>
              <FaChevronLeft /> Mahsulotlar
            </button>
            <h1>{isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</h1>
            <p>Mahsulot ma'lumotlarini to'ldiring va nashr qiling</p>
          </div>
        </div>

        <div className="sd-form-layout">
          <div className="sd-form-main">
            <div className="sd-card sd-form-card">
              <h2>Asosiy ma'lumotlar</h2>

              <div className="sd-field sd-field-full">
                <label>Mahsulot rasmlari</label>
                <div className="sd-upload-grid">
                  {form.images.map((img) => (
                    <div className="sd-upload-item" key={img.id}>
                      <img src={img.url} alt="Mahsulot" />
                      <button
                        className="sd-upload-remove"
                        onClick={() =>
                          setForm({
                            ...form,
                            images: form.images.filter((i) => i.id !== img.id),
                          })
                        }
                        aria-label="Rasmni olib tashlash"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <label className="sd-upload-add">
                    <FaImage />
                    <span>Rasm yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setForm({
                            ...form,
                            images: [
                              ...form.images,
                              { id: Date.now(), url: URL.createObjectURL(file) },
                            ],
                          });
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <small>Birinchi rasm asosiy rasm sifatida ishlatiladi</small>
              </div>

              <div className="sd-field sd-field-full">
                <label>Mahsulot nomi</label>
                <input
                  type="text"
                  placeholder="Masalan: Bolalar futbolkasi Premium"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="sd-field sd-field-full">
                <label>Tavsif</label>
                <textarea
                  rows={4}
                  placeholder="Mahsulot haqida batafsil ma'lumot..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="sd-form-row">
                <div className="sd-field">
                  <label>Kategoriya</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.filter((c) => c.status === "active").map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sd-field">
                  <label>Subkategoriya</label>
                  <input
                    type="text"
                    placeholder="Masalan: Futbolkalar"
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  />
                </div>
              </div>

              <div className="sd-form-row">
                <div className="sd-field">
                  <label>Ulgurji narx (so'm)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25000"
                    value={form.wholesalePrice}
                    onChange={(e) => setForm({ ...form, wholesalePrice: e.target.value })}
                  />
                </div>
                <div className="sd-field">
                  <label>Chakana narx (so'm)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="40000"
                    value={form.retailPrice}
                    onChange={(e) => setForm({ ...form, retailPrice: e.target.value })}
                  />
                </div>
                <div className="sd-field">
                  <label>Chegirma (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="sd-form-row">
                <div className="sd-field">
                  <label>Zaxira miqdori</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="320"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
                <div className="sd-field">
                  <label>Minimal buyurtma miqdori</label>
                  <input
                    type="number"
                    min="1"
                    value={form.minOrder}
                    onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                  />
                </div>
                <div className="sd-field">
                  <label>SKU</label>
                  <input
                    type="text"
                    placeholder="BFT-001"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sd-card sd-form-card">
              <h2>Variantlar</h2>

              <div className="sd-field sd-field-full">
                <label>O'lchamlar</label>
                <ChipToggle
                  options={sizeOptions}
                  value={form.sizes}
                  onChange={(sizes) => setForm({ ...form, sizes })}
                />
              </div>

              <div className="sd-field sd-field-full">
                <label>Ranglar</label>
                <ChipToggle
                  options={COLOR_OPTIONS}
                  value={form.colors}
                  onChange={(colors) => setForm({ ...form, colors })}
                />
              </div>

              <div className="sd-field sd-field-full">
                <div className="sd-field-head">
                  <label>Mahsulot variantlari</label>
                  <button
                    type="button"
                    className="sd-btn sd-btn-ghost sd-btn-sm"
                    onClick={() =>
                      setForm({
                        ...form,
                        variants: [
                          ...form.variants,
                          { id: Date.now(), name: "", price: "", stock: "" },
                        ],
                      })
                    }
                  >
                    <FaPlus /> Variant qo'shish
                  </button>
                </div>
                {form.variants.length === 0 ? (
                  <p className="sd-form-empty">
                    Hali variantlar qo'shilmagan. Masalan: o'lcham yoki rang bo'yicha narx farqi.
                  </p>
                ) : (
                  <div className="sd-variant-list">
                    {form.variants.map((variant) => (
                      <div className="sd-variant-row" key={variant.id}>
                        <input
                          type="text"
                          placeholder="Variant nomi (masalan: 5-6 o'lcham)"
                          value={variant.name}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              variants: form.variants.map((v) =>
                                v.id === variant.id ? { ...v, name: e.target.value } : v
                              ),
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Narx"
                          value={variant.price}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              variants: form.variants.map((v) =>
                                v.id === variant.id ? { ...v, price: e.target.value } : v
                              ),
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Zaxira"
                          value={variant.stock}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              variants: form.variants.map((v) =>
                                v.id === variant.id ? { ...v, stock: e.target.value } : v
                              ),
                            })
                          }
                        />
                        <button
                          type="button"
                          className="sd-icon-btn sd-icon-btn-danger"
                          onClick={() =>
                            setForm({
                              ...form,
                              variants: form.variants.filter((v) => v.id !== variant.id),
                            })
                          }
                          aria-label="Variantni o'chirish"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isClothing && (
              <div className="sd-card sd-form-card">
                <h2>Kiyim-kechak xususiyatlari</h2>
                <div className="sd-form-row">
                  <div className="sd-field">
                    <label>Yosh kategoriyasi</label>
                    <select
                      value={form.ageGroup}
                      onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                    >
                      <option>Bolalar (2-10)</option>
                      <option>O'smirlar (10-16)</option>
                      <option>Chaqaloqlar (0-2)</option>
                    </select>
                  </div>
                  <div className="sd-field">
                    <label>Jinsi</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    >
                      <option>Unisex</option>
                      <option>O'g'il</option>
                      <option>Qiz</option>
                    </select>
                  </div>
                </div>
                <div className="sd-form-row">
                  <div className="sd-field">
                    <label>Material</label>
                    <input
                      type="text"
                      placeholder="Masalan: 95% Paxta"
                      value={form.material}
                      onChange={(e) => setForm({ ...form, material: e.target.value })}
                    />
                  </div>
                  <div className="sd-field">
                    <label>Mavsum</label>
                    <select
                      value={form.season}
                      onChange={(e) => setForm({ ...form, season: e.target.value })}
                    >
                      <option>Barcha mavsum</option>
                      <option>Yoz</option>
                      <option>Kuz</option>
                      <option>Qish</option>
                      <option>Bahor</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sd-form-side">
            <div className="sd-card sd-form-card">
              <h2>Nashr qilish</h2>
              <div className="sd-field sd-field-full">
                <label>Mahsulot statusi</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="draft">Qoralama</option>
                  <option value="active">Aktiv (e'lon qilingan)</option>
                  <option value="hidden">Yashiringan</option>
                </select>
              </div>
              <p className="sd-form-note">
                Aktiv mahsulotlar darhol do'konda ko'rinadi va mijozlar buyurtma berishi mumkin.
              </p>
              <div className="sd-form-actions">
                <button
                  className="sd-btn sd-btn-ghost"
                  onClick={() => saveProduct("draft")}
                  disabled={formSaving}
                >
                  Qoralama saqlash
                </button>
                <button
                  className="sd-btn sd-btn-primary"
                  onClick={() => saveProduct("active")}
                  disabled={formSaving}
                >
                  {formSaving ? "Saqlanmoqda..." : "Mahsulotni nashr qilish"}
                </button>
              </div>
            </div>

            <div className="sd-card sd-form-card sd-preview-card">
              <h2>Ko'rinish oldindan</h2>
              <div className="sd-preview">
                <div className="sd-preview-img">
                  {form.images[0] ? (
                    <img src={form.images[0].url} alt="Mahsulot" />
                  ) : (
                    <span><FaImage /></span>
                  )}
                </div>
                <strong>{form.name || "Mahsulot nomi"}</strong>
                <span className="sd-preview-cat">
                  {form.category} {form.subcategory && "• " + form.subcategory}
                </span>
                <b>{form.wholesalePrice ? formatSum(form.wholesalePrice) : "—"}</b>
                <span className="sd-preview-stock">
                  Zaxira: {form.stock ? form.stock + " dona" : "aniqlanmagan"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     ORDERS
  ========================= */

  function renderOrders() {
    const statusTabs = [
      { id: "all", label: "Barchasi", count: orders.length },
      { id: "yangi", label: "Yangi", count: orders.filter((o) => o.status === "yangi").length },
      { id: "tasdiqlangan", label: "Tasdiqlangan", count: orders.filter((o) => o.status === "tasdiqlangan").length },
      { id: "tayyorlanmoqda", label: "Tayyorlanmoqda", count: orders.filter((o) => o.status === "tayyorlanmoqda").length },
      { id: "jonatildi", label: "Jo'natildi", count: orders.filter((o) => o.status === "jonatildi").length },
      { id: "yetkazildi", label: "Yetkazildi", count: orders.filter((o) => o.status === "yetkazildi").length },
      { id: "bekor_qilindi", label: "Bekor qilindi", count: orders.filter((o) => o.status === "bekor_qilindi").length },
    ];

    return (
      <div className="sd-section sd-orders">
        <div className="sd-section-head">
          <div>
            <h1>Buyurtmalar</h1>
            <p>Barcha buyurtmalarni boshqaring</p>
          </div>
          <div className="sd-section-head-actions">
            <button className="sd-btn sd-btn-ghost" onClick={() => pushToast("info", "Tez orada", "Buyurtma qo'lda qo'shish funksiyasi ishlab chiqilmoqda")}>
              <FaPlus /> Qo'lda qo'shish
            </button>
          </div>
        </div>

        <div className="sd-card sd-filters">
          <div className="sd-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Buyurtma ID yoki mijoz qidirish..."
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
            />
            {orderQuery && (
              <button onClick={() => setOrderQuery("")} aria-label="Tozalash">
                <FaTimes />
              </button>
            )}
          </div>
          <div className="sd-select-box">
            <FaFilter />
            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} aria-label="Holat">
              <option value="all">Barcha holatlar</option>
              <option value="yangi">Yangi</option>
              <option value="tasdiqlangan">Tasdiqlangan</option>
              <option value="tayyorlanmoqda">Tayyorlanmoqda</option>
              <option value="jonatildi">Jo'natildi</option>
              <option value="yetkazildi">Yetkazildi</option>
              <option value="bekor_qilindi">Bekor qilindi</option>
            </select>
          </div>
        </div>

        <div className="sd-orders-tabs">
          <Tabs tabs={statusTabs} active={orderStatus} onChange={setOrderStatus} />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="sd-card">
            <EmptyState
              icon={<FaBoxOpen />}
              title="Buyurtmalar topilmadi"
              text="Qidiruv yoki filtr shartlariga mos buyurtma yo'q."
            />
          </div>
        ) : (
          <div className="sd-card sd-card-table">
            <div className="sd-table-wrap">
              <table className="sd-table sd-order-table">
                <thead>
                  <tr>
                    <th>Buyurtma ID</th>
                    <th>Mijoz</th>
                    <th>Mahsulot</th>
                    <th>Soni</th>
                    <th>Summa</th>
                    <th>Sana</th>
                    <th>To'lov</th>
                    <th>Holat</th>
                    <th className="sd-ta-right">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <button className="sd-order-id" onClick={() => setOrderDetail(order)}>
                          {order.number}
                        </button>
                      </td>
                      <td>
                        <div className="sd-cell-person">
                          <span className="sd-cell-avatar">{order.customer[0]}</span>
                          <div>
                            <strong>{order.customer}</strong>
                            <small>{order.phone}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="sd-cell-product">
                          <img src={order.items[0].image} alt={order.items[0].name} />
                          <div>
                            <strong>{order.items[0].name}</strong>
                            <small>{order.items.length} ta tur</small>
                          </div>
                        </div>
                      </td>
                      <td>{order.items.reduce((s, i) => s + i.qty, 0)} dona</td>
                      <td className="sd-strong">{formatSum(order.amount)}</td>
                      <td className="sd-muted">{formatDate(order.date)}</td>
                      <td className="sd-muted">{order.payment}</td>
                      <td><StatusBadge status={order.status} meta={ORDER_STATUS} /></td>
                      <td className="sd-ta-right">
                        <div className="sd-row-actions">
                          <button className="sd-icon-btn sd-icon-btn-ghost" title="Batafsil" onClick={() => setOrderDetail(order)}>
                            <FaEye />
                          </button>
                          {order.status === "yangi" && (
                            <button className="sd-icon-btn sd-icon-btn-success" title="Qabul qilish" onClick={() => acceptOrder(order)}>
                              <FaCheck />
                            </button>
                          )}
                          {NEXT_ORDER_STATUS[order.status] && (
                            <button className="sd-icon-btn sd-icon-btn-primary" title="Keyingi holat" onClick={() => advanceOrder(order)}>
                              <FaArrowRight />
                            </button>
                          )}
                          {order.status !== "yetkazildi" && order.status !== "bekor_qilindi" && (
                            <button className="sd-icon-btn sd-icon-btn-danger" title="Bekor qilish" onClick={() => cancelOrder(order)}>
                              <FaTimes />
                            </button>
                          )}
                          <button className="sd-icon-btn sd-icon-btn-ghost" title="Hisob-faktura" onClick={() => printInvoice(order)}>
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================
     SALES
  ========================= */

  function renderSales() {
    const overview = [
      { label: "Bugungi sotuvlar", value: formatSum(4850000), trend: "+12.5%", up: true, icon: <FaMoneyBillWave />, tone: "primary" },
      { label: "Bu hafta", value: formatSum(20400000), trend: "+9.8%", up: true, icon: <FaChartLine />, tone: "purple" },
      { label: "Bu oy", value: formatSum(53700000), trend: "+15.2%", up: true, icon: <FaChartBar />, tone: "success" },
      { label: "Bu yil", value: formatSum(268000000), trend: "+22.1%", up: true, icon: <FaWallet />, tone: "warning" },
    ];

    const rangeTabs = [
      { id: "bugun", label: "Bugun" },
      { id: "7kun", label: "7 kun" },
      { id: "30kun", label: "30 kun" },
      { id: "1yil", label: "1 yil" },
    ];

    const metricTabs = [
      { id: "revenue", label: "Daromad" },
      { id: "orders", label: "Buyurtmalar" },
      { id: "sold", label: "Sotilgan" },
    ];

    const activeAnalytics = ANALYTICS[analyticsRange];
    const chartValues = activeAnalytics[analyticsMetric];

    const catSales = [
      { name: "Bolalar kiyimlari", value: 68, amount: 36500000 },
      { name: "Poyabzallar", value: 22, amount: 11800000 },
      { name: "Aksessuarlar", value: 10, amount: 5400000 },
    ];

    return (
      <div className="sd-section sd-sales">
        <div className="sd-section-head">
          <div>
            <h1>Sotuvlar</h1>
            <p>Sotuv ko'rsatkichlari va tahlillar</p>
          </div>
        </div>

        <div className="sd-stats sd-stats-sm">
          {overview.map((card) => (
            <div className="sd-stat" key={card.label}>
              <span className={"sd-stat-icon sd-stat-" + card.tone}>{card.icon}</span>
              <div className="sd-stat-info">
                <span className="sd-stat-label">{card.label}</span>
                <strong>{card.value}</strong>
                <span className={"sd-stat-trend " + (card.up ? "sd-trend-up" : "sd-trend-down")}>
                  {card.up ? "▲" : "▼"} {card.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="sd-card">
          <div className="sd-card-head">
            <div>
              <h2>Sotuvlar tahlili</h2>
              <p>Daromad, buyurtmalar va sotilgan mahsulotlar</p>
            </div>
            <div className="sd-chart-type-toggle">
              <button className={chartType === "line" ? "sd-chart-type-active" : ""} onClick={() => setChartType("line")} title="Chiziqli"><FaChartLine /></button>
              <button className={chartType === "bar" ? "sd-chart-type-active" : ""} onClick={() => setChartType("bar")} title="Ustunli"><FaChartBar /></button>
            </div>
          </div>
          <div className="sd-analytics-controls">
            <Tabs tabs={rangeTabs} active={analyticsRange} onChange={setAnalyticsRange} />
            <div className="sd-analytics-metrics">
              {metricTabs.map((metric) => (
                <button
                  className={"sd-metric-chip " + (analyticsMetric === metric.id ? "sd-metric-chip-active" : "")}
                  key={metric.id}
                  onClick={() => setAnalyticsMetric(metric.id)}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          <SalesChart
            type={chartType}
            labels={activeAnalytics.labels}
            values={chartValues}
            color="var(--sd-primary)"
          />
        </div>

        <div className="sd-sales-grid">
          <div className="sd-card">
            <div className="sd-card-head">
              <div>
                <h2>Kategoriyalar bo'yicha sotuvlar</h2>
                <p>Ushbu oyda</p>
              </div>
            </div>
            <div className="sd-cat-sales">
              {catSales.map((cat) => (
                <div className="sd-cat-sale" key={cat.name}>
                  <div className="sd-cat-sale-head">
                    <span>{cat.name}</span>
                    <b>{formatSum(cat.amount)}</b>
                  </div>
                  <div className="sd-cat-sale-bar">
                    <span style={{ width: cat.value + "%" }} />
                  </div>
                  <small>{cat.value}% ulush</small>
                </div>
              ))}
            </div>
          </div>

          <div className="sd-card sd-card-table">
            <div className="sd-card-head">
              <div>
                <h2>Top mahsulotlar</h2>
                <p>Eng ko'p sotilgan mahsulotlar</p>
              </div>
            </div>
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th>Sotuvlar</th>
                    <th>Daromad</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="sd-cell-product">
                          <img src={p.image} alt={p.name} />
                          <div>
                            <strong>{p.name}</strong>
                            <small>{p.sku}</small>
                          </div>
                        </div>
                      </td>
                      <td>{p.sales} dona</td>
                      <td className="sd-strong">{formatSum(p.wholesalePrice * p.sales)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     CUSTOMERS
  ========================= */

  function renderCustomers() {
    const pageSize = 6;
    const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
    const page = Math.min(customerPage, pageCount);
    const pageItems = filteredCustomers.slice((page - 1) * pageSize, page * pageSize);

    return (
      <div className="sd-section sd-customers">
        <div className="sd-section-head">
          <div>
            <h1>Mijozlar</h1>
            <p>Jami 1.240 ta mijoz</p>
          </div>
        </div>

        <div className="sd-card sd-filters">
          <div className="sd-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Mijoz ismi yoki telefon qidirish..."
              value={customerQuery}
              onChange={(e) => { setCustomerQuery(e.target.value); setCustomerPage(1); }}
            />
            {customerQuery && (
              <button onClick={() => setCustomerQuery("")} aria-label="Tozalash">
                <FaTimes />
              </button>
            )}
          </div>
          <div className="sd-select-box">
            <FaFilter />
            <select value={customerStatus} onChange={(e) => { setCustomerStatus(e.target.value); setCustomerPage(1); }} aria-label="Status">
              <option value="all">Barcha statuslar</option>
              <option value="faol">Faol</option>
              <option value="yangi">Yangi</option>
              <option value="bloklangan">Bloklangan</option>
            </select>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="sd-card">
            <EmptyState
              icon={<FaUsers />}
              title="Mijozlar topilmadi"
              text="Qidiruv yoki filtr shartlariga mos mijoz yo'q."
            />
          </div>
        ) : (
          <div className="sd-card sd-card-table">
            <div className="sd-table-wrap">
              <table className="sd-table sd-customer-table">
                <thead>
                  <tr>
                    <th>Mijoz</th>
                    <th>Telefon</th>
                    <th>Buyurtmalar</th>
                    <th>Umumiy xarajat</th>
                    <th>Oxirgi buyurtma</th>
                    <th>Status</th>
                    <th className="sd-ta-right">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="sd-cell-person">
                          <span className="sd-cell-avatar sd-cell-avatar-lg">{customer.initials}</span>
                          <div>
                            <strong>{customer.name}</strong>
                            <small>ID: {customer.id}</small>
                          </div>
                        </div>
                      </td>
                      <td className="sd-muted">{customer.phone}</td>
                      <td>{customer.orders} ta</td>
                      <td className="sd-strong">{formatSum(customer.spending)}</td>
                      <td className="sd-muted">{formatDate(customer.lastOrder)}</td>
                      <td><StatusBadge status={customer.status} meta={CUSTOMER_STATUS} /></td>
                      <td className="sd-ta-right">
                        <div className="sd-row-actions">
                          <button className="sd-icon-btn sd-icon-btn-ghost" title="Batafsil" onClick={() => openCustomer(customer)}>
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sd-table-foot">
              <p>
                {filteredCustomers.length} ta mijozdan {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filteredCustomers.length)} ko'rsatilmoqda
              </p>
              <Pagination page={page} total={filteredCustomers.length} pageSize={pageSize} onChange={setCustomerPage} />
            </div>
          </div>
        )}

        {customerDetail && (
          <Modal
            title="Mijoz ma'lumotlari"
            subtitle={customerDetail.name}
            onClose={() => setCustomerDetail(null)}
            size="md"
          >
            <div className="sd-customer-modal">
              <div className="sd-customer-hero">
                <span className="sd-customer-hero-avatar">{customerDetail.initials}</span>
                <div>
                  <strong>{customerDetail.name}</strong>
                  <span className="sd-muted">{customerDetail.phone}</span>
                  <StatusBadge status={customerDetail.status} meta={CUSTOMER_STATUS} />
                </div>
              </div>
              <div className="sd-customer-stats">
                <div>
                  <strong>{customerDetail.orders}</strong>
                  <span>Buyurtma</span>
                </div>
                <div>
                  <strong>{formatShortSum(customerDetail.spending)}</strong>
                  <span>so'm xarajat</span>
                </div>
                <div>
                  <strong>{formatDate(customerDetail.lastOrder)}</strong>
                  <span>Oxirgi buyurtma</span>
                </div>
              </div>
              <div className="sd-customer-modal-actions">
                <button
                  className="sd-btn sd-btn-primary"
                  onClick={() => {
                    setCustomerDetail(null);
                    setActiveChat(1);
                    go("messages");
                  }}
                >
                  <FaPaperPlane /> Xabar yozish
                </button>
                <button className="sd-btn sd-btn-danger-soft" onClick={() => pushToast("info", "Mijoz bloklandi", customerDetail.name)}>
                  <FaBan /> Bloklash
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  /* =========================
     INVENTORY
  ========================= */

  function renderInventory() {
    const invCards = [
      { label: "Jami mahsulotlar", value: products.length + " ta", icon: <FaBoxes />, tone: "primary" },
      { label: "Kam zaxira", value: inventoryStats.low.length + " ta", icon: <FaExclamationTriangle />, tone: "warning" },
      { label: "Tugagan", value: inventoryStats.out.length + " ta", icon: <FaTimesCircle />, tone: "danger" },
      { label: "Mavjud zaxira", value: inventoryStats.totalStock + " dona", icon: <FaCheckCircle />, tone: "success" },
    ];

    const tabs = [
      { id: "all", label: "Barchasi", count: products.length },
      { id: "low", label: "Kam zaxira", count: inventoryStats.low.length },
      { id: "out", label: "Tugagan", count: inventoryStats.out.length },
    ];

    const shown =
      lowStockFilter === "low"
        ? inventoryStats.low
        : lowStockFilter === "out"
          ? inventoryStats.out
          : products;

    return (
      <div className="sd-section sd-inventory">
        <div className="sd-section-head">
          <div>
            <h1>Ombor</h1>
            <p>Zaxiralar va inventar boshqaruvi</p>
          </div>
        </div>

        <div className="sd-stats sd-stats-sm">
          {invCards.map((card) => (
            <div className="sd-stat" key={card.label}>
              <span className={"sd-stat-icon sd-stat-" + card.tone}>{card.icon}</span>
              <div className="sd-stat-info">
                <span className="sd-stat-label">{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="sd-inventory-tabs">
          <Tabs tabs={tabs} active={lowStockFilter} onChange={setLowStockFilter} />
        </div>

        {shown.length === 0 ? (
          <div className="sd-card">
            <EmptyState
              icon={<FaBoxes />}
              title="Zaxira yetarli"
              text="Bu filtr bo'yicha barcha mahsulotlar yetarli zaxiraga ega."
            />
          </div>
        ) : (
          <div className="sd-card sd-card-table">
            <div className="sd-table-wrap">
              <table className="sd-table sd-inventory-table">
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th>SKU</th>
                    <th>Zaxira</th>
                    <th>Sotilgan</th>
                    <th>Qoldiq</th>
                    <th>Minimal zaxira</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((product) => {
                    const low = product.stock > 0 && product.stock <= 20;
                    const out = product.stock === 0;
                    const minStock = 20;
                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="sd-cell-product">
                            <img src={product.image} alt={product.name} />
                            <div>
                              <strong>{product.name}</strong>
                              <small>{product.category}</small>
                            </div>
                          </div>
                        </td>
                        <td className="sd-muted">{product.sku}</td>
                        <td>
                          <div className="sd-stock-cell">
                            <div className="sd-stock-bar">
                              <span
                                className={out ? "sd-stock-bar-out" : low ? "sd-stock-bar-low" : ""}
                                style={{ width: Math.min(100, (product.stock / 400) * 100) + "%" }}
                              />
                            </div>
                            <b className={out ? "sd-stock-zero" : low ? "sd-stock-low" : ""}>
                              {product.stock} dona
                            </b>
                          </div>
                        </td>
                        <td>{product.sales} dona</td>
                        <td className="sd-strong">{product.stock} dona</td>
                        <td className="sd-muted">{minStock} dona</td>
                        <td>
                          {out ? (
                            <span className="sd-badge sd-badge-danger">Tugagan</span>
                          ) : low ? (
                            <span className="sd-badge sd-badge-warning">Kam</span>
                          ) : (
                            <span className="sd-badge sd-badge-success">Yetarli</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {inventoryStats.low.length > 0 && (
          <div className="sd-card sd-low-stock-warn">
            <div className="sd-card-head">
              <div>
                <h2>Kam zaxira ogohlantirishlari</h2>
                <p>Quyidagi mahsulotlar tez orada tugashi mumkin</p>
              </div>
              <span className="sd-badge sd-badge-warning">
                <FaExclamationTriangle /> {inventoryStats.low.length} ta
              </span>
            </div>
            <div className="sd-stock-alerts">
              {inventoryStats.low.map((p) => (
                <div className="sd-stock-alert" key={p.id}>
                  <img src={p.image} alt={p.name} />
                  <div>
                    <strong>{p.name}</strong>
                    <small>{p.stock} dona qoldi</small>
                  </div>
                  <button
                    className="sd-btn sd-btn-primary sd-btn-sm"
                    onClick={() => openEditProduct(p)}
                  >
                    <FaPlus /> Zaxira qo'shish
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================
     CATEGORIES
  ========================= */

  function renderCategories() {
    return (
      <div className="sd-section sd-categories">
        <div className="sd-section-head">
          <div>
            <h1>Kategoriyalar</h1>
            <p>Mahsulot kategoriyalarini boshqaring</p>
          </div>
          <button
            className="sd-btn sd-btn-primary"
            onClick={() => setCatModal({ mode: "add", name: "", status: "active" })}
          >
            <FaPlus /> Yangi kategoriya
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="sd-card">
            <EmptyState
              icon={<FaTags />}
              title="Kategoriyalar yo'q"
              text="Yangi kategoriya qo'shib mahsulotlaringizni tartibga soling."
            />
          </div>
        ) : (
          <div className="sd-category-grid">
            {categories.map((cat) => (
              <div className="sd-card sd-category-card" key={cat.id}>
                <div className="sd-category-icon">
                  <FaTags />
                </div>
                <div className="sd-category-info">
                  <strong>{cat.name}</strong>
                  <small>{cat.slug}</small>
                  <span className="sd-category-count">{cat.count} ta mahsulot</span>
                  {cat.status === "active" ? (
                    <span className="sd-badge sd-badge-success">Aktiv</span>
                  ) : (
                    <span className="sd-badge sd-badge-warning">Qoralama</span>
                  )}
                </div>
                <div className="sd-category-actions">
                  <button
                    className="sd-icon-btn sd-icon-btn-ghost"
                    title="Tahrirlash"
                    onClick={() =>
                      setCatModal({ mode: "edit", id: cat.id, name: cat.name, status: cat.status })
                    }
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="sd-icon-btn sd-icon-btn-danger"
                    title="O'chirish"
                    onClick={() =>
                      askConfirm({
                        danger: true,
                        title: "Kategoriyani o'chirish",
                        text: '"' + cat.name + '" kategoriyasini o\'chirmoqchimisiz?',
                        confirmLabel: "O'chirish",
                        action: () => {
                          setCategories((prev) => prev.filter((c) => c.id !== cat.id));
                          pushToast("success", "Kategoriya o'chirildi", cat.name);
                        },
                      })
                    }
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {catModal && (
          <Modal
            title={catModal.mode === "add" ? "Yangi kategoriya" : "Kategoriyani tahrirlash"}
            onClose={() => setCatModal(null)}
            size="sm"
          >
            <div className="sd-modal-form">
              <div className="sd-field">
                <label>Kategoriya nomi</label>
                <input
                  type="text"
                  value={catModal.name}
                  onChange={(e) => setCatModal({ ...catModal, name: e.target.value })}
                  placeholder="Masalan: O'yinchoqlar"
                />
              </div>
              <div className="sd-field">
                <label>Status</label>
                <select
                  value={catModal.status}
                  onChange={(e) => setCatModal({ ...catModal, status: e.target.value })}
                >
                  <option value="active">Aktiv</option>
                  <option value="draft">Qoralama</option>
                </select>
              </div>
              <div className="sd-modal-actions">
                <button className="sd-btn sd-btn-ghost" onClick={() => setCatModal(null)}>Bekor qilish</button>
                <button
                  className="sd-btn sd-btn-primary"
                  onClick={() => {
                    if (!catModal.name.trim()) {
                      pushToast("error", "Xatolik", "Kategoriya nomini kiriting");
                      return;
                    }
                    if (catModal.mode === "add") {
                      setCategories((prev) => [
                        ...prev,
                        {
                          id: Date.now(),
                          name: catModal.name.trim(),
                          slug: catModal.name.trim().toLowerCase().replace(/\s+/g, "-"),
                          count: 0,
                          status: catModal.status,
                        },
                      ]);
                      pushToast("success", "Kategoriya qo'shildi", catModal.name);
                    } else {
                      setCategories((prev) =>
                        prev.map((c) =>
                          c.id === catModal.id
                            ? { ...c, name: catModal.name.trim(), status: catModal.status }
                            : c
                        )
                      );
                      pushToast("success", "Kategoriya yangilandi", catModal.name);
                    }
                    setCatModal(null);
                  }}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  /* =========================
     DISCOUNTS
  ========================= */

  function renderDiscounts() {
    return (
      <div className="sd-section sd-discounts">
        <div className="sd-section-head">
          <div>
            <h1>Chegirmalar</h1>
            <p>Mahsulotlar uchun chegirmalarni boshqaring</p>
          </div>
          <button
            className="sd-btn sd-btn-primary"
            onClick={() =>
              setDiscountModal({ mode: "add", name: "", type: "foiz", value: "", appliesTo: "Barcha mahsulotlar", endDate: "", status: "active" })
            }
          >
            <FaPlus /> Yangi chegirma
          </button>
        </div>

        {discounts.length === 0 ? (
          <div className="sd-card">
            <EmptyState
              icon={<FaPercentage />}
              title="Chegirmalar yo'q"
              text="Yangi chegirma yarating va sotuvlarni oshiring."
            />
          </div>
        ) : (
          <div className="sd-card sd-card-table">
            <div className="sd-table-wrap">
              <table className="sd-table sd-discount-table">
                <thead>
                  <tr>
                    <th>Chegirma</th>
                    <th>Turi</th>
                    <th>Qiymat</th>
                    <th>Qo'llanadi</th>
                    <th>Amal qilish muddati</th>
                    <th>Status</th>
                    <th className="sd-ta-right">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((discount) => (
                    <tr key={discount.id}>
                      <td>
                        <div className="sd-discount-name">
                          <span className="sd-discount-icon"><FaPercentage /></span>
                          <strong>{discount.name}</strong>
                        </div>
                      </td>
                      <td>{discount.type === "foiz" ? "Foiz" : "Miqdor"}</td>
                      <td className="sd-strong">
                        {discount.type === "foiz" ? discount.value + "%" : formatSum(discount.value)}
                      </td>
                      <td className="sd-muted">{discount.appliesTo}</td>
                      <td className="sd-muted">{formatDate(discount.endDate)}</td>
                      <td>
                        <span className={"sd-badge " + (discount.status === "active" ? "sd-badge-success" : "sd-badge-warning")}>
                          {discount.status === "active" ? "Faol" : "To'xtatilgan"}
                        </span>
                      </td>
                      <td className="sd-ta-right">
                        <div className="sd-row-actions">
                          <button
                            className="sd-icon-btn sd-icon-btn-ghost"
                            title={discount.status === "active" ? "To'xtatish" : "Faollashtirish"}
                            onClick={() => {
                              setDiscounts((prev) =>
                                prev.map((d) =>
                                  d.id === discount.id
                                    ? { ...d, status: d.status === "active" ? "paused" : "active" }
                                    : d
                                )
                              );
                              pushToast(
                                discount.status === "active" ? "info" : "success",
                                discount.status === "active" ? "Chegirma to'xtatildi" : "Chegirma faollashtirildi",
                                discount.name
                              );
                            }}
                          >
                            {discount.status === "active" ? <FaPause /> : <FaPlay />}
                          </button>
                          <button
                            className="sd-icon-btn sd-icon-btn-danger"
                            title="O'chirish"
                            onClick={() =>
                              askConfirm({
                                danger: true,
                                title: "Chegirmani o'chirish",
                                text: '"' + discount.name + '" chegirmasini o\'chirmoqchimisiz?',
                                confirmLabel: "O'chirish",
                                action: () => {
                                  setDiscounts((prev) => prev.filter((d) => d.id !== discount.id));
                                  pushToast("success", "Chegirma o'chirildi", discount.name);
                                },
                              })
                            }
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {discountModal && (
          <Modal
            title={discountModal.mode === "add" ? "Yangi chegirma" : "Chegirmani tahrirlash"}
            onClose={() => setDiscountModal(null)}
            size="md"
          >
            <div className="sd-modal-form">
              <div className="sd-field">
                <label>Chegirma nomi</label>
                <input
                  type="text"
                  value={discountModal.name}
                  onChange={(e) => setDiscountModal({ ...discountModal, name: e.target.value })}
                  placeholder="Masalan: Yozgi chegirma"
                />
              </div>
              <div className="sd-form-row">
                <div className="sd-field">
                  <label>Turi</label>
                  <select
                    value={discountModal.type}
                    onChange={(e) => setDiscountModal({ ...discountModal, type: e.target.value })}
                  >
                    <option value="foiz">Foiz</option>
                    <option value="miqdor">Miqdor (so'm)</option>
                  </select>
                </div>
                <div className="sd-field">
                  <label>Qiymat</label>
                  <input
                    type="number"
                    value={discountModal.value}
                    onChange={(e) => setDiscountModal({ ...discountModal, value: e.target.value })}
                    placeholder={discountModal.type === "foiz" ? "10" : "20000"}
                  />
                </div>
              </div>
              <div className="sd-field">
                <label>Qo'llaniladigan mahsulotlar</label>
                <select
                  value={discountModal.appliesTo}
                  onChange={(e) => setDiscountModal({ ...discountModal, appliesTo: e.target.value })}
                >
                  <option>Barcha mahsulotlar</option>
                  {products.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="sd-field">
                <label>Amal qilish muddati</label>
                <input
                  type="date"
                  value={discountModal.endDate}
                  onChange={(e) => setDiscountModal({ ...discountModal, endDate: e.target.value })}
                />
              </div>
              <div className="sd-modal-actions">
                <button className="sd-btn sd-btn-ghost" onClick={() => setDiscountModal(null)}>Bekor qilish</button>
                <button
                  className="sd-btn sd-btn-primary"
                  onClick={() => {
                    if (!discountModal.name.trim() || !discountModal.value) {
                      pushToast("error", "Xatolik", "Nom va qiymatni kiriting");
                      return;
                    }
                    setDiscounts((prev) => [
                      ...prev,
                      {
                        id: Date.now(),
                        name: discountModal.name.trim(),
                        type: discountModal.type,
                        value: Number(discountModal.value),
                        appliesTo: discountModal.appliesTo,
                        endDate: discountModal.endDate || "2026-12-31",
                        status: "active",
                      },
                    ]);
                    setDiscountModal(null);
                    pushToast("success", "Chegirma yaratildi", discountModal.name);
                  }}
                >
                  Yaratish
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  /* =========================
     PAYMENTS
  ========================= */

  function renderPayments() {
    const balanceCards = [
      { label: "Mavjud balans", value: formatSum(SELLER.balance), icon: <FaWallet />, tone: "success", text: "Yechib olish mumkin" },
      { label: "Kutilayotgan balans", value: formatSum(SELLER.pending), icon: <FaClock />, tone: "warning", text: "Tasdiqlanishi kutilmoqda" },
      { label: "Jami daromad", value: formatSum(SELLER.totalEarnings), icon: <FaMoneyBillWave />, tone: "primary", text: "Barcha davrlar bo'yicha" },
      { label: "Yechib olingan", value: formatSum(SELLER.withdrawn), icon: <FaArrowDown />, tone: "info", text: "Bank kartaga" },
    ];

    return (
      <div className="sd-section sd-payments">
        <div className="sd-section-head">
          <div>
            <h1>To'lovlar</h1>
            <p>Balans va to'lovlar tarixini boshqaring</p>
          </div>
          <button className="sd-btn sd-btn-primary" onClick={() => setWithdrawOpen(true)}>
            <FaArrowDown /> Pul yechib olish
          </button>
        </div>

        <div className="sd-stats sd-stats-sm">
          {balanceCards.map((card) => (
            <div className="sd-stat" key={card.label}>
              <span className={"sd-stat-icon sd-stat-" + card.tone}>{card.icon}</span>
              <div className="sd-stat-info">
                <span className="sd-stat-label">{card.label}</span>
                <strong>{card.value}</strong>
                <span className="sd-stat-trend">{card.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="sd-payments-grid">
          <div className="sd-card sd-card-table">
            <div className="sd-card-head">
              <div>
                <h2>To'lovlar tarixi</h2>
                <p>Barcha moliyaviy operatsiyalar</p>
              </div>
            </div>
            <div className="sd-table-wrap">
              <table className="sd-table sd-transaction-table">
                <thead>
                  <tr>
                    <th>Transaksiya ID</th>
                    <th>Sana</th>
                    <th>Turi</th>
                    <th>Izoh</th>
                    <th>Summa</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="sd-order-id">TX-{tx.id}</td>
                      <td className="sd-muted">{formatDate(tx.date)}</td>
                      <td><StatusBadge status={tx.type} meta={TRANSACTION_META} /></td>
                      <td className="sd-muted">{tx.title}</td>
                      <td className={tx.amount < 0 ? "sd-amount-out" : "sd-amount-in"}>
                        {tx.amount < 0 ? "-" : "+"}{formatSum(Math.abs(tx.amount))}
                      </td>
                      <td><StatusBadge status={tx.status} meta={TRANSACTION_STATUS} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sd-side-col">
            <div className="sd-card">
              <div className="sd-card-head">
                <div>
                  <h2>Bank kartasi</h2>
                  <p>Yechib olish ma'lumotlari</p>
                </div>
                <span className="sd-chip"><FaLandmark /> UzCard</span>
              </div>
              <div className="sd-bank-card">
                <div className="sd-bank-card-top">
                  <span>UZCARD</span>
                  <FaLandmark />
                </div>
                <strong>8600 •••• •••• 4821</strong>
                <div className="sd-bank-card-bottom">
                  <span>E. GIMMING</span>
                  <span>09/27</span>
                </div>
              </div>
              <button
                className="sd-btn sd-btn-ghost sd-btn-block"
                onClick={() => pushToast("info", "Karta ma'lumotlari", "Yangi karta qo'shish oynasi ochiladi")}
              >
                <FaPlus /> Karta qo'shish
              </button>
            </div>

            <div className="sd-card">
              <div className="sd-card-head">
                <div>
                  <h2>To'lov sozlamalari</h2>
                  <p>Afzalliklaringizni tanlang</p>
                </div>
              </div>
              <div className="sd-toggle-list">
                <div className="sd-toggle-row">
                  <div>
                    <strong>Avtomatik yechib olish</strong>
                    <p>Balans 10 mln dan oshganda avtomatik yechib olish</p>
                  </div>
                  <Toggle checked={settings.paymentAuto || false} onChange={(v) => setSettings({ ...settings, paymentAuto: v })} label="Avtomatik yechib olish" />
                </div>
                <div className="sd-toggle-row">
                  <div>
                    <strong>To'lov bildirishnomalari</strong>
                    <p>Har bir to'lov bo'yicha SMS va push bildirishnoma</p>
                  </div>
                  <Toggle checked={settings.notifPayment} onChange={(v) => setSettings({ ...settings, notifPayment: v })} label="To'lov bildirishnomalari" />
                </div>
                <div className="sd-toggle-row">
                  <div>
                    <strong>Naqd to'lov rejimi</strong>
                    <p>Buyurtmalarda naqd to'lovni qabul qilish</p>
                  </div>
                  <Toggle checked={settings.paymentCash || true} onChange={(v) => setSettings({ ...settings, paymentCash: v })} label="Naqd to'lov rejimi" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {withdrawOpen && (
          <Modal
            title="Pul yechib olish"
            subtitle="Mablag' bank kartangizga o'tkaziladi"
            onClose={() => setWithdrawOpen(false)}
            size="sm"
          >
            <div className="sd-modal-form">
              <div className="sd-withdraw-balance">
                <span>Mavjud balans</span>
                <strong>{formatSum(SELLER.balance)}</strong>
              </div>
              <div className="sd-field">
                <label>Yechib olish summasi</label>
                <input
                  type="number"
                  min="10000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Masalan: 5000000"
                />
              </div>
              <div className="sd-quick-amounts">
                {[1000000, 3000000, 5000000].map((amount) => (
                  <button key={amount} onClick={() => setWithdrawAmount(String(amount))}>
                    {formatShortSum(amount)}
                  </button>
                ))}
              </div>
              <div className="sd-field">
                <label>Karta</label>
                <select defaultValue="8600 *** *** 4821">
                  <option>8600 *** *** 4821 (UzCard)</option>
                  <option>9860 *** *** 1122 (Humo)</option>
                </select>
              </div>
              <div className="sd-modal-actions">
                <button className="sd-btn sd-btn-ghost" onClick={() => setWithdrawOpen(false)}>Bekor qilish</button>
                <button className="sd-btn sd-btn-primary" onClick={handleWithdraw}>
                  <FaArrowDown /> Yechib olish
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  /* =========================
     REPORTS
  ========================= */

  function renderReports() {
    const reportTabs = [
      { id: "sales", label: "Sotuvlar" },
      { id: "revenue", label: "Daromad" },
      { id: "products", label: "Mahsulotlar" },
      { id: "customers", label: "Mijozlar" },
      { id: "inventory", label: "Ombor" },
    ];

    const rangeTabs = [
      { id: "daily", label: "Kunlik" },
      { id: "weekly", label: "Haftalik" },
      { id: "monthly", label: "Oylik" },
      { id: "yearly", label: "Yillik" },
    ];

    const salesRows = {
      daily: [
        { period: "12-avgust", revenue: 1250000, orders: 6, sold: 160 },
        { period: "13-avgust", revenue: 2400000, orders: 11, sold: 300 },
        { period: "14-avgust", revenue: 1850000, orders: 9, sold: 240 },
        { period: "15-avgust", revenue: 3150000, orders: 14, sold: 410 },
        { period: "16-avgust", revenue: 2700000, orders: 13, sold: 360 },
        { period: "17-avgust", revenue: 4200000, orders: 21, sold: 580 },
        { period: "18-avgust", revenue: 4850000, orders: 24, sold: 640 },
      ],
      weekly: [
        { period: "1-hafta", revenue: 9200000, orders: 42, sold: 1200 },
        { period: "2-hafta", revenue: 12500000, orders: 58, sold: 1650 },
        { period: "3-hafta", revenue: 14800000, orders: 66, sold: 1900 },
        { period: "4-hafta", revenue: 17200000, orders: 79, sold: 2250 },
      ],
      monthly: [
        { period: "Mart", revenue: 26800000, orders: 132, sold: 3900 },
        { period: "Aprel", revenue: 22100000, orders: 109, sold: 3200 },
        { period: "May", revenue: 31500000, orders: 148, sold: 4500 },
        { period: "Iyun", revenue: 27400000, orders: 127, sold: 3700 },
        { period: "Iyul", revenue: 33800000, orders: 156, sold: 4800 },
        { period: "Avgust", revenue: 39700000, orders: 181, sold: 5400 },
      ],
      yearly: [
        { period: "2024", revenue: 178000000, orders: 920, sold: 26400 },
        { period: "2025", revenue: 236000000, orders: 1240, sold: 34800 },
        { period: "2026", revenue: 268000000, orders: 1380, sold: 39200 },
      ],
    };

    const rows = salesRows[reportRange];

    const reportSummaries = {
      sales: [
        { label: "Jami sotuvlar", value: formatShortSum(rows.reduce((s, r) => s + r.sold, 0)) + " dona", tone: "primary" },
        { label: "Jami buyurtmalar", value: rows.reduce((s, r) => s + r.orders, 0) + " ta", tone: "purple" },
        { label: "O'rtacha chek", value: formatShortSum(rows.reduce((s, r) => s + r.revenue, 0) / Math.max(1, rows.reduce((s, r) => s + r.orders, 0))) + " so'm", tone: "success" },
      ],
    };

    return (
      <div className="sd-section sd-reports">
        <div className="sd-section-head">
          <div>
            <h1>Hisobotlar</h1>
            <p>Batafsil tahlil va eksport imkoniyatlari</p>
          </div>
          <div className="sd-export-buttons">
            <button className="sd-btn sd-btn-danger-soft" onClick={() => exportReport("pdf")}>
              <FaFilePdf /> PDF
            </button>
            <button className="sd-btn sd-btn-success-soft" onClick={() => exportReport("excel")}>
              <FaFileExcel /> Excel
            </button>
            <button className="sd-btn sd-btn-ghost" onClick={() => exportReport("csv")}>
              <FaFileCsv /> CSV
            </button>
          </div>
        </div>

        <div className="sd-report-tabs">
          <Tabs tabs={reportTabs} active={reportTab} onChange={setReportTab} />
        </div>

        <div className="sd-card sd-filters sd-range-filters">
          <div>
            <FaCalendarAlt />
            <span>Davr:</span>
          </div>
          <Tabs tabs={rangeTabs} active={reportRange} onChange={setReportRange} />
        </div>

        <div className="sd-stats sd-stats-sm">
          {reportSummaries.sales.map((card) => (
            <div className="sd-stat" key={card.label}>
              <span className={"sd-stat-icon sd-stat-" + card.tone}><FaFileAlt /></span>
              <div className="sd-stat-info">
                <span className="sd-stat-label">{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="sd-card sd-card-table">
          <div className="sd-card-head">
            <div>
              <h2>
                {reportTab === "sales" && "Sotuvlar hisoboti"}
                {reportTab === "revenue" && "Daromad hisoboti"}
                {reportTab === "products" && "Mahsulotlar hisoboti"}
                {reportTab === "customers" && "Mijozlar hisoboti"}
                {reportTab === "inventory" && "Ombor hisoboti"}
              </h2>
              <p>
                {reportRange === "daily" && "Kunlik hisobot"}
                {reportRange === "weekly" && "Haftalik hisobot"}
                {reportRange === "monthly" && "Oylik hisobot"}
                {reportRange === "yearly" && "Yillik hisobot"}
              </p>
            </div>
          </div>

          {reportTab === "sales" && (
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Davr</th>
                    <th>Daromad</th>
                    <th>Buyurtmalar</th>
                    <th>Sotilgan</th>
                    <th>O'rtacha chek</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.period}>
                      <td className="sd-strong">{row.period}</td>
                      <td>{formatSum(row.revenue)}</td>
                      <td>{row.orders} ta</td>
                      <td>{row.sold} dona</td>
                      <td className="sd-muted">{formatShortSum(row.revenue / Math.max(1, row.orders))} so'm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportTab === "revenue" && (
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Davr</th>
                    <th>Yalpi daromad</th>
                    <th>Komissiya (10%)</th>
                    <th>Aniq daromad</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.period}>
                      <td className="sd-strong">{row.period}</td>
                      <td>{formatSum(row.revenue)}</td>
                      <td className="sd-muted">-{formatSum(row.revenue * 0.1)}</td>
                      <td className="sd-strong">{formatSum(row.revenue * 0.9)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportTab === "products" && (
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th>Kategoriya</th>
                    <th>Sotuvlar</th>
                    <th>Daromad</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="sd-cell-product">
                          <img src={p.image} alt={p.name} />
                          <div>
                            <strong>{p.name}</strong>
                            <small>{p.sku}</small>
                          </div>
                        </div>
                      </td>
                      <td className="sd-muted">{p.category}</td>
                      <td>{p.sales} dona</td>
                      <td className="sd-strong">{formatSum(p.wholesalePrice * p.sales)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportTab === "customers" && (
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Mijoz</th>
                    <th>Buyurtmalar</th>
                    <th>Umumiy xarajat</th>
                    <th>Oxirgi buyurtma</th>
                  </tr>
                </thead>
                <tbody>
                  {[...CUSTOMERS].sort((a, b) => b.spending - a.spending).map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="sd-cell-person">
                          <span className="sd-cell-avatar">{c.initials}</span>
                          <strong>{c.name}</strong>
                        </div>
                      </td>
                      <td>{c.orders} ta</td>
                      <td className="sd-strong">{formatSum(c.spending)}</td>
                      <td className="sd-muted">{formatDate(c.lastOrder)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportTab === "inventory" && (
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th>Zaxira</th>
                    <th>Minimal</th>
                    <th>Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const low = p.stock > 0 && p.stock <= 20;
                    const out = p.stock === 0;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="sd-cell-product">
                            <img src={p.image} alt={p.name} />
                            <div>
                              <strong>{p.name}</strong>
                              <small>{p.sku}</small>
                            </div>
                          </div>
                        </td>
                        <td>{p.stock} dona</td>
                        <td className="sd-muted">20 dona</td>
                        <td>
                          {out ? (
                            <span className="sd-badge sd-badge-danger">Tugagan</span>
                          ) : low ? (
                            <span className="sd-badge sd-badge-warning">Kam</span>
                          ) : (
                            <span className="sd-badge sd-badge-success">Yetarli</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================
     MESSAGES
  ========================= */

  function renderMessages() {
    const conversation =
      messages.find((conv) => conv.id === activeChat) || messages[0];

    return (
      <div className="sd-section sd-messages">
        <div className="sd-section-head">
          <div>
            <h1>Xabarlar</h1>
            <p>Mijozlar bilan muloqot</p>
          </div>
        </div>
        <div
          className={"sd-messages-panel sd-card " + (activeChat ? "sd-chat-thread-open" : "")}
        >
          <div className="sd-chat-list">
            <div className="sd-chat-list-head">
              <h2>Suhbatlar</h2>
              <span className="sd-chip sd-chip-primary">{unreadChats} yangi</span>
            </div>
            {messages.map((conv) => (
              <button
                className={"sd-chat-item " + (activeChat === conv.id ? "sd-chat-active" : "")}
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
              >
                <span className="sd-chat-avatar">
                  {conv.initials}
                  <i className={conv.online ? "sd-online" : ""} />
                </span>
                <span className="sd-chat-meta">
                  <strong>{conv.name}</strong>
                  <small>{conv.role}</small>
                  <p>{conv.messages[conv.messages.length - 1].text}</p>
                </span>
                <span className="sd-chat-side">
                  <small>{conv.messages[conv.messages.length - 1].time}</small>
                  {conv.unread > 0 && <i className="sd-unread-dot" />}
                </span>
              </button>
            ))}
          </div>

          <div className="sd-chat-thread">
            <div className="sd-chat-thread-head">
              <button
                className="sd-chat-back"
                onClick={() => setActiveChat(null)}
                aria-label="Orqaga"
              >
                <FaArrowLeft />
              </button>
              <span className="sd-chat-avatar sd-chat-avatar-lg">
                {conversation.initials}
                <i className={conversation.online ? "sd-online" : ""} />
              </span>
              <div className="sd-chat-thread-title">
                <strong>{conversation.name}</strong>
                <small>{conversation.phone} • {conversation.orders} ta buyurtma</small>
              </div>
              <button className="sd-icon-btn sd-icon-btn-ghost" aria-label="Ko'proq">
                <FaEllipsisV />
              </button>
            </div>

            <div className="sd-chat-body">
              {conversation.messages.map((message) => (
                <div
                  className={"sd-msg " + (message.from === "me" ? "sd-msg-me" : "sd-msg-them")}
                  key={message.id}
                >
                  <p>{message.text}</p>
                  <span>
                    {message.time}
                    {message.from === "me" && <FaCheckDouble />}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="sd-chat-input">
              <button className="sd-chat-attach" onClick={sendChatImage} title="Rasm yuklash" aria-label="Rasm yuklash">
                <FaImage />
              </button>
              <input
                type="text"
                placeholder="Xabar yozing..."
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button className="sd-chat-send" onClick={sendMessage} aria-label="Yuborish" title="Yuborish">
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     NOTIFICATIONS
  ========================= */

  function renderNotifications() {
    const NOTIF_META = {
      order: { icon: <FaBoxOpen />, tone: "primary" },
      payment: { icon: <FaMoneyBillWave />, tone: "success" },
      stock: { icon: <FaBoxes />, tone: "warning" },
      message: { icon: <FaEnvelope />, tone: "info" },
      approve: { icon: <FaCheckCircle />, tone: "success" },
      reject: { icon: <FaTimesCircle />, tone: "danger" },
      system: { icon: <FaShieldAlt />, tone: "purple" },
    };

    const filters = [
      { id: "all", label: "Barchasi" },
      { id: "unread", label: "O'qilmagan" },
      { id: "order", label: "Buyurtma" },
      { id: "payment", label: "To'lov" },
      { id: "stock", label: "Ombor" },
      { id: "message", label: "Xabarlar" },
      { id: "system", label: "Tizim" },
    ];

    return (
      <div className="sd-section sd-notifications">
        <div className="sd-section-head">
          <div>
            <h1>Bildirishnomalar</h1>
            <p>
              {unreadCount > 0
                ? unreadCount + " ta o'qilmagan bildirishnoma"
                : "Barcha bildirishnomalar o'qilgan"}
            </p>
          </div>
          <button
            className="sd-btn sd-btn-ghost sd-btn-sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <FaCheckDouble /> Barchasini o'qilgan qilish
          </button>
        </div>

        <div className="sd-notif-tabs">
          <Tabs tabs={filters} active={notifFilter} onChange={setNotifFilter} />
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="sd-card">
            <EmptyState
              icon={<FaBell />}
              title="Bildirishnomalar yo'q"
              text="Bu bo'limda hech qanday bildirishnoma topilmadi."
            />
          </div>
        ) : (
          <div className="sd-notif-list">
            {filteredNotifications.map((item) => {
              const meta = NOTIF_META[item.type] || NOTIF_META.system;
              return (
                <div
                  className={"sd-notif " + (item.read ? "" : "sd-notif-unread")}
                  key={item.id}
                >
                  <span className={"sd-notif-icon sd-stat-" + meta.tone}>{meta.icon}</span>
                  <div className="sd-notif-body">
                    <div className="sd-notif-title">
                      <strong>{item.title}</strong>
                      {!item.read && <i className="sd-unread-dot" />}
                    </div>
                    <p>{item.text}</p>
                    <small>{item.time}</small>
                  </div>
                  <div className="sd-notif-actions">
                    {!item.read && (
                      <button
                        className="sd-icon-btn sd-icon-btn-ghost"
                        onClick={() => markRead(item.id)}
                        title="O'qildi deb belgilash"
                        aria-label="O'qildi"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      className="sd-icon-btn sd-icon-btn-danger"
                      onClick={() => removeNotification(item.id)}
                      title="O'chirish"
                      aria-label="O'chirish"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* =========================
     STORE
  ========================= */

  function renderStore() {
    const storeTabs = [
      { id: "edit", label: "Ma'lumotlarni tahrirlash" },
      { id: "preview", label: "Do'kon ko'rinishi" },
    ];

    const previewProducts = products.filter((p) => p.status === "active").slice(0, 4);

    return (
      <div className="sd-section sd-store">
        <div className="sd-section-head">
          <div>
            <h1>Do'konim</h1>
            <p>Do'koningizni boshqaring va mijozlarga qanday ko'rinishini ko'ring</p>
          </div>
          <Link to="/shop" className="sd-btn sd-btn-ghost sd-btn-sm">
            Do'konni ochish <FaExternalLinkAlt />
          </Link>
        </div>

        <div className="sd-store-tabs">
          <Tabs tabs={storeTabs} active={storeTab} onChange={setStoreTab} />
        </div>

        {storeTab === "edit" ? (
          <div className="sd-form-layout">
            <div className="sd-form-main">
              <div className="sd-card sd-form-card">
                <h2>Do'kon ma'lumotlari</h2>

                <div className="sd-field sd-field-full">
                  <label>Do'kon logotipi</label>
                  <div className="sd-logo-upload">
                    <div className="sd-logo-placeholder">
                      <span>{SELLER.initials}</span>
                    </div>
                    <button className="sd-btn sd-btn-ghost sd-btn-sm" onClick={() => pushToast("info", "Logotip", "Yangi logotip yuklash oynasi ochiladi")}>
                      <FaCamera /> Logotip yuklash
                    </button>
                  </div>
                </div>

                <div className="sd-field sd-field-full">
                  <label>Do'kon qoplamasi</label>
                  <div className="sd-cover-upload">
                    <span><FaImage /></span>
                    <button className="sd-btn sd-btn-ghost sd-btn-sm" onClick={() => pushToast("info", "Qoplama", "Yangi qoplama yuklash oynasi ochiladi")}>
                      <FaCamera /> Qoplama yuklash
                    </button>
                  </div>
                </div>

                <div className="sd-field sd-field-full">
                  <label>Do'kon nomi</label>
                  <input
                    type="text"
                    value={store.name}
                    onChange={(e) => setStore({ ...store, name: e.target.value })}
                  />
                </div>

                <div className="sd-field sd-field-full">
                  <label>Tavsif</label>
                  <textarea
                    rows={4}
                    value={store.description}
                    onChange={(e) => setStore({ ...store, description: e.target.value })}
                  />
                </div>

                <div className="sd-form-row">
                  <div className="sd-field">
                    <label>Telefon</label>
                    <input
                      type="text"
                      value={store.phone}
                      onChange={(e) => setStore({ ...store, phone: e.target.value })}
                    />
                  </div>
                  <div className="sd-field">
                    <label>Manzil</label>
                    <input
                      type="text"
                      value={store.address}
                      onChange={(e) => setStore({ ...store, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="sd-card sd-form-card">
                <h2>Ish vaqti</h2>
                <div className="sd-form-row">
                  <div className="sd-field">
                    <label>Ochilish</label>
                    <input
                      type="time"
                      value={store.openTime}
                      onChange={(e) => setStore({ ...store, openTime: e.target.value })}
                    />
                  </div>
                  <div className="sd-field">
                    <label>Yopilish</label>
                    <input
                      type="time"
                      value={store.closeTime}
                      onChange={(e) => setStore({ ...store, closeTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="sd-field sd-field-full">
                  <label>Ish kunlari</label>
                  <ChipToggle
                    options={["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"]}
                    value={store.days}
                    onChange={(days) => setStore({ ...store, days })}
                  />
                </div>
              </div>

              <div className="sd-card sd-form-card">
                <h2>Ijtimoiy tarmoqlar</h2>
                <div className="sd-form-row">
                  <div className="sd-field">
                    <label><FaInstagram /> Instagram</label>
                    <input
                      type="text"
                      value={store.instagram}
                      onChange={(e) => setStore({ ...store, instagram: e.target.value })}
                    />
                  </div>
                  <div className="sd-field">
                    <label><FaTelegramPlane /> Telegram</label>
                    <input
                      type="text"
                      value={store.telegram}
                      onChange={(e) => setStore({ ...store, telegram: e.target.value })}
                    />
                  </div>
                </div>
                <div className="sd-field sd-field-full">
                  <label><FaFacebookF /> Facebook</label>
                  <input
                    type="text"
                    value={store.facebook}
                    onChange={(e) => setStore({ ...store, facebook: e.target.value })}
                  />
                </div>
              </div>

              <div className="sd-card sd-form-card">
                <h2>Yetkazib berish</h2>
                <div className="sd-field sd-field-full">
                  <label>Yetkazib berish ma'lumoti</label>
                  <textarea
                    rows={3}
                    value={store.delivery}
                    onChange={(e) => setStore({ ...store, delivery: e.target.value })}
                  />
                </div>
                <div className="sd-field">
                  <label>Bepul yetkazib berish (so'm)</label>
                  <input
                    type="number"
                    value={store.freeDeliveryFrom}
                    onChange={(e) => setStore({ ...store, freeDeliveryFrom: Number(e.target.value) })}
                  />
                  <small>Shu summadan yuqori buyurtmalar uchun yetkazib berish bepul</small>
                </div>
              </div>

              <div className="sd-form-actions sd-form-actions-bottom">
                <button className="sd-btn sd-btn-primary" onClick={handleStoreSave}>
                  <FaCheck /> Saqlash
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="sd-store-preview">
            <div className="sd-storefront">
              <div className="sd-storefront-cover">
                <div className="sd-storefront-logo">{SELLER.initials}</div>
              </div>
              <div className="sd-storefront-body">
                <div className="sd-storefront-head">
                  <div>
                    <h2>{store.name}</h2>
                    <span className="sd-rating">
                      <FaStar /> {SELLER.rating} <em>• 1.240 mijoz</em>
                    </span>
                  </div>
                  <span className="sd-badge sd-badge-success">
                    <FaCheckCircle /> Tasdiqlangan do'kon
                  </span>
                </div>
                <p className="sd-storefront-desc">{store.description}</p>

                <div className="sd-storefront-stats">
                  <div>
                    <strong>{products.filter((p) => p.status === "active").length}</strong>
                    <span>Mahsulot</span>
                  </div>
                  <div>
                    <strong>156</strong>
                    <span>Buyurtma</span>
                  </div>
                  <div>
                    <strong>24 soat</strong>
                    <span>Yetkazish</span>
                  </div>
                </div>

                <div className="sd-storefront-info">
                  <div className="sd-storefront-info-item">
                    <FaMapMarkerAlt />
                    <div>
                      <small>Manzil</small>
                      <strong>{store.address}</strong>
                    </div>
                  </div>
                  <div className="sd-storefront-info-item">
                    <FaPhoneAlt />
                    <div>
                      <small>Telefon</small>
                      <strong>{store.phone}</strong>
                    </div>
                  </div>
                  <div className="sd-storefront-info-item">
                    <FaClock />
                    <div>
                      <small>Ish vaqti</small>
                      <strong>{store.openTime} – {store.closeTime} ({store.days.join(", ")})</strong>
                    </div>
                  </div>
                  <div className="sd-storefront-info-item">
                    <FaTruck />
                    <div>
                      <small>Yetkazib berish</small>
                      <strong>{store.delivery}</strong>
                    </div>
                  </div>
                </div>

                <div className="sd-storefront-social">
                  {store.instagram && <a href="#" onClick={(e) => e.preventDefault()}><FaInstagram /> {store.instagram}</a>}
                  {store.telegram && <a href="#" onClick={(e) => e.preventDefault()}><FaTelegramPlane /> {store.telegram}</a>}
                  {store.facebook && <a href="#" onClick={(e) => e.preventDefault()}><FaFacebookF /> {store.facebook}</a>}
                </div>

                <div className="sd-storefront-products">
                  <h3>Mahsulotlar</h3>
                  <div className="sd-storefront-grid">
                    {previewProducts.map((p) => (
                      <div className="sd-storefront-product" key={p.id}>
                        <img src={p.image} alt={p.name} />
                        <div>
                          <strong>{p.name}</strong>
                          <b>{formatSum(p.wholesalePrice)}</b>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================
     PROFILE
  ========================= */

  function renderProfile() {
    const profileTabs = [
      { id: "overview", label: "Umumiy ko'rinish" },
      { id: "security", label: "Xavfsizlik" },
    ];

    return (
      <div className="sd-section sd-profile">
        <div className="sd-section-head">
          <div>
            <h1>Profil</h1>
            <p>Sotuvchi hisobingiz ma'lumotlari</p>
          </div>
          <button className="sd-btn sd-btn-primary" onClick={() => { setSettingsTab("account"); go("settings"); }}>
            <FaEdit /> Profilni tahrirlash
          </button>
        </div>

        <div className="sd-profile-tabs">
          <Tabs tabs={profileTabs} active={profileTab} onChange={setProfileTab} />
        </div>

        {profileTab === "overview" ? (
          <div className="sd-profile-grid">
            <div className="sd-card sd-profile-card">
              <div className="sd-profile-cover">
                <span className="sd-profile-badge"><FaCheckCircle /> Tasdiqlangan</span>
              </div>
              <div className="sd-profile-avatar">{SELLER.initials}</div>
              <div className="sd-profile-heading">
                <h2>{SELLER.name}</h2>
                <span className="sd-chip sd-chip-primary"><FaStore /> {SELLER.shop}</span>
              </div>
              <p className="sd-profile-bio">{SELLER.bio}</p>

              <div className="sd-profile-stats">
                <div>
                  <strong>{SELLER.rating}</strong>
                  <span>Reyting</span>
                </div>
                <div>
                  <strong>328</strong>
                  <span>Mahsulot</span>
                </div>
                <div>
                  <strong>156</strong>
                  <span>Buyurtma</span>
                </div>
              </div>

              <div className="sd-profile-actions">
                <button className="sd-btn sd-btn-primary" onClick={() => { setSettingsTab("account"); go("settings"); }}>
                  <FaEdit /> Profilni tahrirlash
                </button>
                <button className="sd-btn sd-btn-ghost" onClick={() => setProfileTab("security")}>
                  <FaLock /> Parolni o'zgartirish
                </button>
              </div>
            </div>

            <div className="sd-card">
              <div className="sd-card-head">
                <div>
                  <h2>Shaxsiy ma'lumotlar</h2>
                  <p>Hisobingiz haqidagi asosiy ma'lumotlar</p>
                </div>
              </div>
              <div className="sd-info-list">
                <div className="sd-info-item">
                  <span className="sd-info-icon"><FaUser /></span>
                  <div>
                    <small>To'liq ism</small>
                    <strong>{SELLER.name}</strong>
                  </div>
                </div>
                <div className="sd-info-item">
                  <span className="sd-info-icon"><FaPhoneAlt /></span>
                  <div>
                    <small>Telefon raqam</small>
                    <strong>{SELLER.phone}</strong>
                  </div>
                </div>
                <div className="sd-info-item">
                  <span className="sd-info-icon"><FaEnvelope /></span>
                  <div>
                    <small>Elektron pochta</small>
                    <strong>{SELLER.email}</strong>
                  </div>
                </div>
                <div className="sd-info-item">
                  <span className="sd-info-icon"><FaStore /></span>
                  <div>
                    <small>Do'kon nomi</small>
                    <strong>{SELLER.shop}</strong>
                  </div>
                </div>
                <div className="sd-info-item">
                  <span className="sd-info-icon"><FaBuilding /></span>
                  <div>
                    <small>Biznes turi</small>
                    <strong>Yakka tartibdagi tadbirkor</strong>
                  </div>
                </div>
                <div className="sd-info-item">
                  <span className="sd-info-icon"><FaMapMarkerAlt /></span>
                  <div>
                    <small>Manzil</small>
                    <strong>{SELLER.address}</strong>
                  </div>
                </div>
                <div className="sd-info-item">
                  <span className="sd-info-icon"><FaCalendarAlt /></span>
                  <div>
                    <small>Ro'yxatdan o'tgan</small>
                    <strong>{SELLER.registered}</strong>
                  </div>
                </div>
                <div className="sd-info-item">
                  <span className="sd-info-icon"><FaIdCard /></span>
                  <div>
                    <small>Verifikatsiya statusi</small>
                    <strong><span className="sd-badge sd-badge-success"><FaCheck /> Tasdiqlangan</span></strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="sd-card sd-settings-panel">
            <div className="sd-card-head">
              <div>
                <h2>Parol va xavfsizlik</h2>
                <p>Hisobingizni himoya qiling</p>
              </div>
            </div>
            <div className="sd-form-grid">
              <div className="sd-field">
                <label>Joriy parol</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="sd-field">
                <label>Yangi parol</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="sd-field sd-field-full">
                <label>Yangi parolni tasdiqlang</label>
                <input type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="sd-toggle-row">
              <div>
                <strong>Ikki bosqichli tasdiqlash (2FA)</strong>
                <p>Kirishda qo'shimcha kod talab qilinadi</p>
              </div>
              <Toggle checked={settings.twoFactor} onChange={(v) => setSettings({ ...settings, twoFactor: v })} label="Ikki bosqichli tasdiqlash" />
            </div>
            <div className="sd-settings-actions">
              <button className="sd-btn sd-btn-primary" onClick={handleSettingsSave}>
                Parolni yangilash
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================
     SETTINGS
  ========================= */

  function renderSettings() {
    const tabs = [
      { id: "account", label: "Hisob", icon: <FaUser /> },
      { id: "store", label: "Do'kon", icon: <FaStore /> },
      { id: "payment", label: "To'lov", icon: <FaWallet /> },
      { id: "delivery", label: "Yetkazib berish", icon: <FaTruck /> },
      { id: "notification", label: "Bildirishnomalar", icon: <FaBell /> },
      { id: "privacy", label: "Maxfiylik", icon: <FaShieldAlt /> },
      { id: "security", label: "Xavfsizlik", icon: <FaLock /> },
      { id: "language", label: "Til", icon: <FaGlobe /> },
      { id: "currency", label: "Valyuta", icon: <FaMoneyBillWave /> },
      { id: "theme", label: "Mavzu", icon: <FaMoon /> },
    ];

    return (
      <div className="sd-section sd-settings">
        <div className="sd-section-head">
          <div>
            <h1>Sozlamalar</h1>
            <p>Hisob va do'kon sozlamalarini boshqaring</p>
          </div>
        </div>

        <div className="sd-settings-layout">
          <div className="sd-settings-nav sd-card">
            {tabs.map((tab) => (
              <button
                className={"sd-settings-tab " + (settingsTab === tab.id ? "sd-settings-tab-active" : "")}
                key={tab.id}
                onClick={() => setSettingsTab(tab.id)}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="sd-settings-content">
            <div className="sd-card sd-settings-panel">
              {settingsTab === "account" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Hisob ma'lumotlari</h2>
                      <p>Sotuvchi hisobi ma'lumotlarini yangilang</p>
                    </div>
                  </div>
                  <div className="sd-form-grid">
                    <div className="sd-field">
                      <label>To'liq ism</label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      />
                    </div>
                    <div className="sd-field">
                      <label>Elektron pochta</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      />
                    </div>
                    <div className="sd-field">
                      <label>Telefon raqam</label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      />
                    </div>
                    <div className="sd-field">
                      <label>Do'kon nomi</label>
                      <input
                        type="text"
                        value={store.name}
                        onChange={(e) => setStore({ ...store, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="sd-settings-actions">
                    <button className="sd-btn sd-btn-primary" onClick={handleSettingsSave}>
                      Saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "store" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Do'kon sozlamalari</h2>
                      <p>Do'kon haqidagi qisqacha ma'lumot</p>
                    </div>
                  </div>
                  <div className="sd-form-grid">
                    <div className="sd-field">
                      <label>Do'kon nomi</label>
                      <input
                        type="text"
                        value={store.name}
                        onChange={(e) => setStore({ ...store, name: e.target.value })}
                      />
                    </div>
                    <div className="sd-field">
                      <label>Telefon</label>
                      <input
                        type="text"
                        value={store.phone}
                        onChange={(e) => setStore({ ...store, phone: e.target.value })}
                      />
                    </div>
                    <div className="sd-field sd-field-full">
                      <label>Tavsif</label>
                      <textarea
                        rows={3}
                        value={store.description}
                        onChange={(e) => setStore({ ...store, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="sd-settings-actions">
                    <button className="sd-btn sd-btn-primary" onClick={handleStoreSave}>
                      Saqlash
                    </button>
                    <button className="sd-btn sd-btn-ghost" onClick={() => go("store")}>
                      Batafsil sozlamalar <FaChevronRight />
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "payment" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>To'lov sozlamalari</h2>
                      <p>To'lov afzalliklaringizni tanlang</p>
                    </div>
                  </div>
                  <div className="sd-toggle-list">
                    <div className="sd-toggle-row">
                      <div>
                        <strong>Avtomatik yechib olish</strong>
                        <p>Balans ma'lum summadan oshganda avtomatik o'tkazish</p>
                      </div>
                      <Toggle checked={settings.paymentAuto || false} onChange={(v) => setSettings({ ...settings, paymentAuto: v })} label="Avtomatik yechib olish" />
                    </div>
                    <div className="sd-toggle-row">
                      <div>
                        <strong>Naqd to'lov</strong>
                        <p>Buyurtmalarda naqd to'lovni qabul qilish</p>
                      </div>
                      <Toggle checked={settings.paymentCash || true} onChange={(v) => setSettings({ ...settings, paymentCash: v })} label="Naqd to'lov" />
                    </div>
                  </div>
                  <div className="sd-settings-actions">
                    <button className="sd-btn sd-btn-primary" onClick={handleSettingsSave}>
                      Saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "delivery" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Yetkazib berish sozlamalari</h2>
                      <p>Yetkazib berish usullarini boshqaring</p>
                    </div>
                  </div>
                  <div className="sd-toggle-list">
                    <div className="sd-toggle-row">
                      <div>
                        <strong>Standart yetkazib berish</strong>
                        <p>3-5 kun ichida yetkazib berish</p>
                      </div>
                      <Toggle checked={settings.deliveryStandard || true} onChange={(v) => setSettings({ ...settings, deliveryStandard: v })} label="Standart yetkazib berish" />
                    </div>
                    <div className="sd-toggle-row">
                      <div>
                        <strong>Tezkor yetkazib berish</strong>
                        <p>24 soat ichida yetkazib berish</p>
                      </div>
                      <Toggle checked={settings.deliveryExpress || true} onChange={(v) => setSettings({ ...settings, deliveryExpress: v })} label="Tezkor yetkazib berish" />
                    </div>
                  </div>
                  <div className="sd-field">
                    <label>Bepul yetkazib berish summasi</label>
                    <input
                      type="number"
                      value={store.freeDeliveryFrom}
                      onChange={(e) => setStore({ ...store, freeDeliveryFrom: Number(e.target.value) })}
                    />
                  </div>
                  <div className="sd-settings-actions">
                    <button className="sd-btn sd-btn-primary" onClick={handleSettingsSave}>
                      Saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "notification" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Bildirishnoma sozlamalari</h2>
                      <p>Qaysi bildirishnomalarni olishni tanlang</p>
                    </div>
                  </div>
                  <div className="sd-toggle-list">
                    {[
                      { key: "notifOrder", title: "Yangi buyurtmalar", text: "Yangi buyurtma kelganda xabar berish" },
                      { key: "notifPayment", title: "To'lovlar", text: "To'lov qabul qilinganda xabar berish" },
                      { key: "notifStock", title: "Kam zaxira", text: "Zaxira tugash arafasida ogohlantirish" },
                      { key: "notifMessages", title: "Mijoz xabarlari", text: "Yangi mijoz xabari kelganda xabar berish" },
                      { key: "notifNews", title: "Platforma yangiliklari", text: "Platforma yangilanishlari va aksiyalar" },
                    ].map((item) => (
                      <div className="sd-toggle-row" key={item.key}>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.text}</p>
                        </div>
                        <Toggle
                          checked={settings[item.key]}
                          onChange={(v) => setSettings({ ...settings, [item.key]: v })}
                          label={item.title}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="sd-settings-actions">
                    <button className="sd-btn sd-btn-primary" onClick={handleSettingsSave}>
                      Saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "privacy" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Maxfiylik</h2>
                      <p>Ma'lumotlaringizdan foydalanishni boshqaring</p>
                    </div>
                  </div>
                  <div className="sd-toggle-list">
                    <div className="sd-toggle-row">
                      <div>
                        <strong>Telefon raqamni yashirish</strong>
                        <p>Mijozlarga telefon raqamingizni ko'rsatmaslik</p>
                      </div>
                      <Toggle checked={settings.privatePhone} onChange={(v) => setSettings({ ...settings, privatePhone: v })} label="Telefon raqamni yashirish" />
                    </div>
                    <div className="sd-toggle-row">
                      <div>
                        <strong>Sotuv statistikasini ko'rsatish</strong>
                        <p>Do'kon sahifasida sotuv statistikasini ko'rsatish</p>
                      </div>
                      <Toggle checked={settings.showStats} onChange={(v) => setSettings({ ...settings, showStats: v })} label="Sotuv statistikasini ko'rsatish" />
                    </div>
                  </div>
                  <div className="sd-settings-actions">
                    <button className="sd-btn sd-btn-primary" onClick={handleSettingsSave}>
                      Saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "security" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Xavfsizlik</h2>
                      <p>Hisobingizni himoya qiling</p>
                    </div>
                  </div>
                  <div className="sd-form-grid">
                    <div className="sd-field">
                      <label>Joriy parol</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <div className="sd-field">
                      <label>Yangi parol</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <div className="sd-field sd-field-full">
                      <label>Yangi parolni tasdiqlang</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="sd-toggle-row">
                    <div>
                      <strong>Ikki bosqichli tasdiqlash (2FA)</strong>
                      <p>Kirishda qo'shimcha kod talab qilinadi</p>
                    </div>
                    <Toggle checked={settings.twoFactor} onChange={(v) => setSettings({ ...settings, twoFactor: v })} label="Ikki bosqichli tasdiqlash" />
                  </div>
                  <div className="sd-settings-actions">
                    <button className="sd-btn sd-btn-primary" onClick={handleSettingsSave}>
                      Parolni yangilash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "language" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Til</h2>
                      <p>Interfeys tilini tanlang</p>
                    </div>
                  </div>
                  <div className="sd-language-grid">
                    {[
                      { id: "uz", label: "O'zbek", flag: "🇺🇿" },
                      { id: "ru", label: "Русский", flag: "🇷🇺" },
                      { id: "en", label: "English", flag: "🇬🇧" },
                      { id: "tr", label: "Türkçe", flag: "🇹🇷" },
                    ].map((lang) => (
                      <button
                        className={"sd-lang-card " + (settings.language === lang.id ? "sd-lang-active" : "")}
                        key={lang.id}
                        onClick={() => {
                          setSettings({ ...settings, language: lang.id });
                          localStorage.setItem("language", lang.id);
                          pushToast("success", "Til tanlandi", lang.label);
                        }}
                      >
                        <span>{lang.flag}</span>
                        <strong>{lang.label}</strong>
                        {settings.language === lang.id && <FaCheck />}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {settingsTab === "currency" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Valyuta</h2>
                      <p>Narxlarda ko'rsatiladigan valyutani tanlang</p>
                    </div>
                  </div>
                  <div className="sd-language-grid">
                    {[
                      { id: "UZS", label: "So'm (UZS)", flag: "🇺🇿" },
                      { id: "USD", label: "Dollar (USD)", flag: "🇺🇸" },
                      { id: "RUB", label: "Rubl (RUB)", flag: "🇷🇺" },
                    ].map((cur) => (
                      <button
                        className={"sd-lang-card " + (settings.currency === cur.id ? "sd-lang-active" : "")}
                        key={cur.id}
                        onClick={() => {
                          setSettings({ ...settings, currency: cur.id });
                          pushToast("success", "Valyuta tanlandi", cur.label);
                        }}
                      >
                        <span>{cur.flag}</span>
                        <strong>{cur.label}</strong>
                        {settings.currency === cur.id && <FaCheck />}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {settingsTab === "theme" && (
                <>
                  <div className="sd-card-head">
                    <div>
                      <h2>Mavzu</h2>
                      <p>Ko'rinish uslubini tanlang</p>
                    </div>
                  </div>
                  <div className="sd-theme-cards">
                    <button
                      className={"sd-theme-card " + (!dark ? "sd-theme-active" : "")}
                      onClick={() => setDark(false)}
                    >
                      <span className="sd-theme-preview sd-theme-preview-light" />
                      <strong><FaSun /> Kunduzgi</strong>
                    </button>
                    <button
                      className={"sd-theme-card " + (dark ? "sd-theme-active" : "")}
                      onClick={() => setDark(true)}
                    >
                      <span className="sd-theme-preview sd-theme-preview-dark" />
                      <strong><FaMoon /> Tungi</strong>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN RENDER
  ========================================================= */

  const mobileNav = [
    NAV[0],
    NAV[1],
    NAV[2],
    NAV[10],
    NAV[13],
  ];

  const mobileShort = {
    dashboard: "Bosh sahifa",
    products: "Mahsulot",
    orders: "Buyurtma",
    messages: "Xabarlar",
    profile: "Profil",
  };

  return (
    <div className={"sd-dashboard " + (dark ? "sd-dark" : "")}>
      {/* ================= SIDEBAR ================= */}
      <aside className={"sd-sidebar " + (drawer ? "sd-sidebar-open" : "")}>
        <div className="sd-sidebar-head">
          <Link to="/" className="sd-brand" onClick={() => setDrawer(false)}>
            <span className="sd-brand-mark">D</span>
            <span className="sd-brand-text">Dukoni <b>Sotuvchi</b></span>
          </Link>
          <button className="sd-sidebar-close" onClick={() => setDrawer(false)} aria-label="Yopish">
            <FaTimes />
          </button>
        </div>

        <nav className="sd-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.id}>
              <p className="sd-nav-label">{group.label}</p>
              {NAV.filter((item) => item.group === group.id).map((item) => {
                const badge = navBadge(item.id);
                return (
                  <button
                    className={"sd-nav-item " + (section === item.id ? "sd-nav-active" : "")}
                    key={item.id}
                    onClick={() => go(item.id)}
                  >
                    <span className="sd-nav-icon">{item.icon}</span>
                    <span className="sd-nav-text">{item.label}</span>
                    {badge > 0 && <span className="sd-nav-badge">{badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}

          <p className="sd-nav-label sd-nav-label-logout">Hisob</p>
          <button className="sd-nav-item sd-nav-logout" onClick={handleLogout}>
            <span className="sd-nav-icon"><FaSignOutAlt /></span>
            <span className="sd-nav-text">Chiqish</span>
          </button>
        </nav>

        <div className="sd-sidebar-user">
          <div className="sd-sidebar-avatar">{SELLER.initials}</div>
          <div>
            <strong>{SELLER.name}</strong>
            <small>{SELLER.shop}</small>
          </div>
        </div>
      </aside>

      {drawer && <div className="sd-sidebar-overlay" onClick={() => setDrawer(false)} />}

      {/* ================= MAIN ================= */}
      <div className="sd-main">
        <header className="sd-header">
          <button className="sd-burger" onClick={() => setDrawer(true)} aria-label="Menyu">
            <FaBars />
          </button>

          <div className="sd-header-title">
            <strong>{sectionTitle}</strong>
          </div>

          <div className="sd-header-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Buyurtma yoki mahsulot qidirish..."
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              onFocus={() => setProfileMenu(false)}
            />
            {headerQuery && (
              <button onClick={() => setHeaderQuery("")} aria-label="Tozalash">
                <FaTimes />
              </button>
            )}
            {headerResults.length > 0 && (
              <div className="sd-header-results">
                {headerResults.map((result) =>
                  result.kind === "order" ? (
                    <button
                      key={result.id}
                      onClick={() => {
                        setOrderDetail(result);
                        setHeaderQuery("");
                      }}
                    >
                      <span className="sd-header-result-icon"><FaBoxOpen /></span>
                      <span>
                        <strong>{result.number}</strong>
                        <small>{result.customer} • {formatSum(result.amount)}</small>
                      </span>
                      <FaChevronRight />
                    </button>
                  ) : (
                    <button
                      key={result.id}
                      onClick={() => {
                        setHeaderQuery("");
                        openEditProduct(result);
                      }}
                    >
                      <span className="sd-header-result-icon"><FaTshirt /></span>
                      <span>
                        <strong>{result.name}</strong>
                        <small>{result.sku} • {formatSum(result.wholesalePrice)}</small>
                      </span>
                      <FaChevronRight />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <div className="sd-header-right">
            <button className="sd-header-icon sd-theme-toggle" onClick={toggleDark} title={dark ? "Kunduzgi rejim" : "Tungi rejim"} aria-label="Rejimni almashtirish">
              {dark ? <FaSun /> : <FaMoon />}
            </button>

            <button className="sd-header-icon" onClick={() => go("messages")} title="Xabarlar" aria-label="Xabarlar">
              <FaEnvelope />
              {unreadChats > 0 && <span className="sd-bell-dot">{unreadChats}</span>}
            </button>

            <button className="sd-header-icon" onClick={() => go("notifications")} title="Bildirishnomalar" aria-label="Bildirishnomalar">
              <FaBell />
              {unreadCount > 0 && <span className="sd-bell-dot">{unreadCount}</span>}
            </button>

            <div className="sd-profile-wrap">
              <button className="sd-profile-btn" onClick={() => setProfileMenu((prev) => !prev)} aria-label="Profil menyusi">
                <span className="sd-header-avatar">
                  {SELLER.initials}
                  <i className={online ? "sd-online sd-online-sm" : ""} />
                </span>
                <span className="sd-profile-name">
                  <strong>{SELLER.name}</strong>
                  <small>{SELLER.shop}</small>
                </span>
                <FaChevronDown className={profileMenu ? "sd-chevron-up" : ""} />
              </button>

              {profileMenu && (
                <div className="sd-dropdown">
                  <div className="sd-dropdown-head">
                    <span className="sd-dropdown-avatar">{SELLER.initials}</span>
                    <div>
                      <strong>{SELLER.name}</strong>
                      <small>{SELLER.shop}</small>
                    </div>
                  </div>
                  <div className="sd-dropdown-status">
                    <span className={online ? "sd-status-on" : ""}>
                      <FaUserShield /> {online ? "Onlayn" : "Oflayn"}
                    </span>
                    <Toggle checked={online} onChange={setOnline} label="Onlayn holat" />
                  </div>
                  <button onClick={() => go("store")}>
                    <FaStore /> Do'konim
                  </button>
                  <button onClick={() => go("profile")}>
                    <FaUser /> Profil
                  </button>
                  <button onClick={() => go("settings")}>
                    <FaCog /> Sozlamalar
                  </button>
                  <button className="sd-dropdown-danger" onClick={handleLogout}>
                    <FaSignOutAlt /> Chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="sd-content">
          {loading ? (
            <div className="sd-section">
              <div className="sd-greet">
                <div>
                  <Skeleton style={{ width: 260, height: 30 }} />
                  <Skeleton style={{ width: 380, height: 14 }} />
                </div>
              </div>
              <div className="sd-stats">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="sd-stat sd-skel-stat" key={index}>
                    <Skeleton style={{ width: 54, height: 54, borderRadius: 16 }} />
                    <div>
                      <Skeleton style={{ width: 110, height: 12 }} />
                      <Skeleton style={{ width: 80, height: 22 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="sd-dash-grid">
                <div className="sd-card">
                  <Skeleton style={{ width: 180, height: 20 }} />
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div className="sd-skel-row" key={index}>
                      <Skeleton style={{ width: "100%", height: 52 }} />
                    </div>
                  ))}
                </div>
                <div className="sd-side-col">
                  <div className="sd-card">
                    <Skeleton style={{ width: 150, height: 20 }} />
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div className="sd-skel-row" key={index}>
                        <Skeleton style={{ width: "100%", height: 44 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {section === "dashboard" && renderDashboard()}
              {section === "products" && (productView === "list" ? renderProducts() : renderProductForm())}
              {section === "orders" && renderOrders()}
              {section === "sales" && renderSales()}
              {section === "customers" && renderCustomers()}
              {section === "inventory" && renderInventory()}
              {section === "categories" && renderCategories()}
              {section === "discounts" && renderDiscounts()}
              {section === "payments" && renderPayments()}
              {section === "reports" && renderReports()}
              {section === "messages" && renderMessages()}
              {section === "notifications" && renderNotifications()}
              {section === "store" && renderStore()}
              {section === "profile" && renderProfile()}
              {section === "settings" && renderSettings()}
            </>
          )}
        </main>
      </div>

      {/* ================= MOBILE NAV ================= */}
      <nav className="sd-mobile-nav" aria-label="Mobil navigatsiya">
        {mobileNav.map((item) => {
          const badge = navBadge(item.id);
          return (
            <button
              className={"sd-mnav-item " + (section === item.id ? "sd-mnav-active" : "")}
              key={item.id}
              onClick={() => go(item.id)}
            >
              <span className="sd-mnav-icon">
                {item.icon}
                {badge > 0 && <i>{badge}</i>}
              </span>
              <small>{mobileShort[item.id] || item.label}</small>
            </button>
          );
        })}
      </nav>

      <ToastStack toasts={toasts} dismiss={dismissToast} />

      {confirm && (
        <ConfirmDialog
          data={confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm.action?.();
            setConfirm(null);
          }}
        />
      )}

      {orderDetail && (
        <Modal
          title={"Buyurtma " + orderDetail.number}
          subtitle={orderDetail.customer + " • " + orderDetail.phone}
          onClose={() => setOrderDetail(null)}
          size="lg"
        >
          <div className="sd-order-modal">
            <div className="sd-order-modal-head">
              <StatusBadge status={orderDetail.status} meta={ORDER_STATUS} />
              <span className="sd-muted">{formatDate(orderDetail.date)}</span>
            </div>

            <div className="sd-order-modal-items">
              {orderDetail.items.map((item) => (
                <div className="sd-order-modal-item" key={item.name}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.qty} dona • {formatSum(item.price)}</small>
                  </div>
                  <b>{formatSum(item.price * item.qty)}</b>
                </div>
              ))}
            </div>

            <div className="sd-order-modal-summary">
              <div>
                <span>To'lov usuli</span>
                <strong>{orderDetail.payment}</strong>
              </div>
              <div>
                <span>Jami mahsulot</span>
                <strong>{orderDetail.items.reduce((s, i) => s + i.qty, 0)} dona</strong>
              </div>
              <div>
                <span>Umumiy summa</span>
                <strong className="sd-order-total">{formatSum(orderDetail.amount)}</strong>
              </div>
            </div>

            <div className="sd-order-track">
              {[
                { label: "Yangi", done: true },
                { label: "Tasdiqlangan", done: orderDetail.status !== "yangi" },
                { label: "Tayyorlanmoqda", done: ["tayyorlanmoqda", "jonatildi", "yetkazildi"].includes(orderDetail.status) },
                { label: "Jo'natildi", done: ["jonatildi", "yetkazildi"].includes(orderDetail.status) },
                { label: "Yetkazildi", done: orderDetail.status === "yetkazildi" },
              ].map((step, index) => (
                <div className={"sd-track-step " + (step.done ? "sd-track-done" : "")} key={step.label}>
                  <span className="sd-track-dot">{step.done ? <FaCheck /> : <span>{index + 1}</span>}</span>
                  <p>{step.label}</p>
                </div>
              ))}
            </div>

            <div className="sd-order-modal-actions">
              {orderDetail.status === "yangi" && (
                <button className="sd-btn sd-btn-primary" onClick={() => { acceptOrder(orderDetail); setOrderDetail(null); }}>
                  <FaCheck /> Qabul qilish
                </button>
              )}
              {NEXT_ORDER_STATUS[orderDetail.status] && (
                <button className="sd-btn sd-btn-ghost" onClick={() => { advanceOrder(orderDetail); setOrderDetail({ ...orderDetail, status: NEXT_ORDER_STATUS[orderDetail.status] }); }}>
                  <FaArrowRight /> Keyingi holatga o'tkazish
                </button>
              )}
              {orderDetail.status !== "yetkazildi" && orderDetail.status !== "bekor_qilindi" && (
                <button className="sd-btn sd-btn-danger-soft" onClick={() => { cancelOrder(orderDetail); setOrderDetail(null); }}>
                  <FaTimes /> Bekor qilish
                </button>
              )}
              <button className="sd-btn sd-btn-ghost" onClick={() => printInvoice(orderDetail)}>
                <FaPrint /> Hisob-faktura
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}