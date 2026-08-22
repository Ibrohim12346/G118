import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaColumns,
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaShoppingCart,
  FaEnvelope,
  FaBell,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaShoppingBag,
  FaClock,
  FaMoneyBillWave,
  FaEye,
  FaFilter,
  FaStar,
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaCreditCard,
  FaTruck,
  FaArrowRight,
  FaPaperPlane,
  FaCheckDouble,
  FaEllipsisV,
  FaRegComment,
  FaArrowLeft,
  FaCheck,
  FaFire,
  FaShieldAlt,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserCog,
  FaKey,
  FaLock,
  FaGlobe,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaCalendarAlt,
  FaEdit,
  FaDownload,
  FaHeadset,
  FaHourglassStart,
  FaTimesCircle,
} from "react-icons/fa";

import "./DashboardPage.css";

import { getProducts } from "../api.js";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../cart.js";

/* =========================================================
   HELPERS
========================================================= */

function formatSum(value) {
  const n = Math.round(Number(value) || 0);
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm`;
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

const MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

function monthLabel(iso) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
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
   STATUS META
========================================================= */

const STATUS = {
  yetkazildi: { label: "Yetkazildi", tone: "success", icon: FaCheckCircle },
  jarayonda: { label: "Jarayonda", tone: "warning", icon: FaClock },
  kutilmoqda: { label: "Kutilmoqda", tone: "info", icon: FaHourglassStart },
  bekor_qilindi: { label: "Bekor qilindi", tone: "danger", icon: FaTimesCircle },
};

/* =========================================================
   USER
========================================================= */

const USER = {
  name: "Aziz Karimov",
  firstName: "Aziz",
  role: "Premium mijoz",
  email: "aziz.karimov@mail.com",
  phone: "+998 99 092 49 85",
  address: "Toshkent, Yunusobod tumani, 12-uy",
  registered: "2024-yil 12-mart",
  bio: "Ulgurji kiyim-kechak xaridori. Premium Store bilan 2024-yildan beri hamkorlik qilaman.",
};

const NOTIF_KEY = "premium_store_notifications";
const FAV_REMOVED_KEY = "premium_store_fav_removed";

/* =========================================================
   ORDERS
========================================================= */

const IMG = {
  jacket:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5",
  hoodie:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  shirt:
    "https://images.unsplash.com/photo-1603252109303-2751441dd157",
  dress:
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
  jeans:
    "https://images.unsplash.com/photo-1542272604-787c3835535d",
  sneakers:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  bag:
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
  coat:
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3",
  polo:
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
  scarf:
    "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9",
  watch:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  glasses:
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
};

const ORDERS = [
  {
    id: 10482,
    number: "PS-10482",
    date: "2026-08-14",
    status: "yetkazildi",
    payment: "Karta",
    delivery: "Tezkor yetkazib berish",
    total: 2450000,
    items: [
      {
        name: "Premium qishki ko'ylagi",
        category: "Erkaklar",
        image: IMG.jacket,
        qty: 2,
        price: 820000,
      },
      {
        name: "Keshi ko'ylagi",
        category: "Erkaklar",
        image: IMG.coat,
        qty: 3,
        price: 270000,
      },
    ],
  },
  {
    id: 10481,
    number: "PS-10481",
    date: "2026-08-12",
    status: "jarayonda",
    payment: "Naqd",
    delivery: "Standart yetkazib berish",
    total: 980000,
    items: [
      {
        name: "Streetwear huddy",
        category: "Erkaklar",
        image: IMG.hoodie,
        qty: 4,
        price: 245000,
      },
    ],
  },
  {
    id: 10480,
    number: "PS-10480",
    date: "2026-08-09",
    status: "kutilmoqda",
    payment: "Karta",
    delivery: "Standart yetkazib berish",
    total: 1540000,
    items: [
      {
        name: "Ayollar ko'ylagi",
        category: "Ayollar",
        image: IMG.dress,
        qty: 5,
        price: 308000,
      },
    ],
  },
  {
    id: 10479,
    number: "PS-10479",
    date: "2026-08-02",
    status: "yetkazildi",
    payment: "Karta",
    delivery: "Tezkor yetkazib berish",
    total: 3120000,
    items: [
      {
        name: "Premium jinsi shim",
        category: "Erkaklar",
        image: IMG.jeans,
        qty: 6,
        price: 250000,
      },
      {
        name: "Sneakers Classic",
        category: "Poyabzallar",
        image: IMG.sneakers,
        qty: 2,
        price: 810000,
      },
    ],
  },
  {
    id: 10478,
    number: "PS-10478",
    date: "2026-07-28",
    status: "bekor_qilindi",
    payment: "Naqd",
    delivery: "Standart yetkazib berish",
    total: 640000,
    items: [
      {
        name: "Erkaklar ko'ylagi",
        category: "Erkaklar",
        image: IMG.shirt,
        qty: 4,
        price: 160000,
      },
    ],
  },
  {
    id: 10477,
    number: "PS-10477",
    date: "2026-07-21",
    status: "yetkazildi",
    payment: "Karta",
    delivery: "Tezkor yetkazib berish",
    total: 1860000,
    items: [
      {
        name: "Ayollar teri sumkasi",
        category: "Aksessuarlar",
        image: IMG.bag,
        qty: 3,
        price: 620000,
      },
    ],
  },
  {
    id: 10476,
    number: "PS-10476",
    date: "2026-07-15",
    status: "jarayonda",
    payment: "Karta",
    delivery: "Standart yetkazib berish",
    total: 725000,
    items: [
      {
        name: "Polo premium",
        category: "Erkaklar",
        image: IMG.polo,
        qty: 5,
        price: 145000,
      },
    ],
  },
  {
    id: 10475,
    number: "PS-10475",
    date: "2026-07-03",
    status: "yetkazildi",
    payment: "Naqd",
    delivery: "Standart yetkazib berish",
    total: 430000,
    items: [
      {
        name: "Ipak sharf",
        category: "Aksessuarlar",
        image: IMG.scarf,
        qty: 2,
        price: 215000,
      },
    ],
  },
  {
    id: 10474,
    number: "PS-10474",
    date: "2026-06-24",
    status: "yetkazildi",
    payment: "Karta",
    delivery: "Tezkor yetkazib berish",
    total: 2990000,
    items: [
      {
        name: "Premium soat",
        category: "Aksessuarlar",
        image: IMG.watch,
        qty: 1,
        price: 1950000,
      },
      {
        name: "Quyoshdan himoya ko'zoynagi",
        category: "Aksessuarlar",
        image: IMG.glasses,
        qty: 2,
        price: 520000,
      },
    ],
  },
  {
    id: 10473,
    number: "PS-10473",
    date: "2026-06-11",
    status: "bekor_qilindi",
    payment: "Naqd",
    delivery: "Standart yetkazib berish",
    total: 890000,
    items: [
      {
        name: "Ayollar jinsi",
        category: "Ayollar",
        image: IMG.jeans,
        qty: 3,
        price: 296000,
      },
    ],
  },
  {
    id: 10472,
    number: "PS-10472",
    date: "2026-05-30",
    status: "yetkazildi",
    payment: "Karta",
    delivery: "Tezkor yetkazib berish",
    total: 1120000,
    items: [
      {
        name: "Streetwear huddy",
        category: "Erkaklar",
        image: IMG.hoodie,
        qty: 4,
        price: 245000,
      },
      {
        name: "Erkaklar ko'ylagi",
        category: "Erkaklar",
        image: IMG.shirt,
        qty: 2,
        price: 160000,
      },
    ],
  },
  {
    id: 10471,
    number: "PS-10471",
    date: "2026-05-18",
    status: "yetkazildi",
    payment: "Karta",
    delivery: "Standart yetkazib berish",
    total: 1550000,
    items: [
      {
        name: "Ayollar ko'ylagi",
        category: "Ayollar",
        image: IMG.dress,
        qty: 5,
        price: 308000,
      },
    ],
  },
];

/* =========================================================
   MOCK PRODUCTS (favorites fallback)
========================================================= */

const MOCK_PRODUCTS = [
  {
    id: 9001,
    title: "Premium qishki ko'ylagi",
    category: "Erkaklar",
    price: 820000,
    wholesale_price: 820000,
    image_url: IMG.jacket,
    rating: 4.8,
  },
  {
    id: 9002,
    title: "Streetwear huddy",
    category: "Erkaklar",
    price: 245000,
    wholesale_price: 245000,
    image_url: IMG.hoodie,
    rating: 4.6,
  },
  {
    id: 9003,
    title: "Ayollar ko'ylagi",
    category: "Ayollar",
    price: 308000,
    wholesale_price: 308000,
    image_url: IMG.dress,
    rating: 4.9,
  },
  {
    id: 9004,
    title: "Premium jinsi shim",
    category: "Erkaklar",
    price: 250000,
    wholesale_price: 250000,
    image_url: IMG.jeans,
    rating: 4.5,
  },
  {
    id: 9005,
    title: "Sneakers Classic",
    category: "Poyabzallar",
    price: 810000,
    wholesale_price: 810000,
    image_url: IMG.sneakers,
    rating: 4.7,
  },
  {
    id: 9006,
    title: "Ayollar teri sumkasi",
    category: "Aksessuarlar",
    price: 620000,
    wholesale_price: 620000,
    image_url: IMG.bag,
    rating: 4.8,
  },
  {
    id: 9007,
    title: "Premium soat",
    category: "Aksessuarlar",
    price: 1950000,
    wholesale_price: 1950000,
    image_url: IMG.watch,
    rating: 5.0,
  },
  {
    id: 9008,
    title: "Quyoshdan himoya ko'zoynagi",
    category: "Aksessuarlar",
    price: 520000,
    wholesale_price: 520000,
    image_url: IMG.glasses,
    rating: 4.4,
  },
];

/* =========================================================
   NOTIFICATIONS
========================================================= */

const NOTIFICATIONS_DEFAULT = [
  {
    id: 1,
    type: "order",
    title: "Yangi buyurtma qabul qilindi",
    text: "PS-10481 buyurtmangiz qabul qilindi va qayta ishlanmoqda.",
    time: "5 daqiqa oldin",
    read: false,
  },
  {
    id: 2,
    type: "status",
    title: "Buyurtma holati yangilandi",
    text: "PS-10482 buyurtmangiz yetkazib berildi. Fikr bildirishni unutmang!",
    time: "2 soat oldin",
    read: false,
  },
  {
    id: 3,
    type: "promo",
    title: "Maxsus aksiya: -20%",
    text: "Ulgurji buyurtmalarda 20% chegirma. 31-avgustgacha amal qiladi.",
    time: "Kecha",
    read: false,
  },
  {
    id: 4,
    type: "system",
    title: "Xavfsizlik maslahati",
    text: "Hisobingiz xavfsizligini oshirish uchun ikki bosqichli tasdiqlashni yoqing.",
    time: "2 kun oldin",
    read: true,
  },
  {
    id: 5,
    type: "order",
    title: "Buyurtma bekor qilindi",
    text: "PS-10478 buyurtmangiz sizning so'rovingiz bo'yicha bekor qilindi.",
    time: "3 kun oldin",
    read: true,
  },
  {
    id: 6,
    type: "promo",
    title: "Yangi to'plam chiqdi",
    text: "2026 kuz-qish kolleksiyasi endi mavjud. Birinchi bo'lib ko'ring!",
    time: "5 kun oldin",
    read: true,
  },
  {
    id: 7,
    type: "system",
    title: "Xizmat yangilanishi",
    text: "Premium Store yangi versiyaga yangilandi. Ko'proq funksiyalar endi mavjud.",
    time: "1 hafta oldin",
    read: true,
  },
];

/* =========================================================
   CONVERSATIONS
========================================================= */

const CONVERSATIONS = [
  {
    id: 1,
    name: "Premium Store — Yordam",
    online: true,
    role: "Qo'llab-quvvatlash",
    unread: 1,
    messages: [
      { id: 1, from: "them", text: "Assalomu alaykum, Aziz! Xush kelibsiz 👋", time: "09:12" },
      { id: 2, from: "them", text: "Qanday masala bo'yicha yordam kerak?", time: "09:12" },
      { id: 3, from: "me", text: "Assalomu alaykum! PS-10481 buyurtmam qachon yetib keladi?", time: "09:15" },
    ],
  },
  {
    id: 2,
    name: "Madina Yusupova",
    online: true,
    role: "Menejer",
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "Assalomu alaykum! Ulgurji narxlar bo'yicha taklif tayyor.", time: "Kecha" },
      { id: 2, from: "me", text: "Rahmat, ko'rib chiqaman.", time: "Kecha" },
    ],
  },
  {
    id: 3,
    name: "Temur Abdullayev",
    online: false,
    role: "Xaridor",
    unread: 0,
    messages: [
      { id: 1, from: "me", text: "Salom! To'plam bo'yicha savol bor edi.", time: "2 kun oldin" },
      { id: 2, from: "them", text: "Savolingizni yuboring, albatta yordam beraman.", time: "2 kun oldin" },
    ],
  },
  {
    id: 4,
    name: "Premium Store — Yangiliklar",
    online: false,
    role: "Marketing",
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "Yangi kuz-qish kolleksiyamiz chiqdi! 🍂", time: "5 kun oldin" },
    ],
  },
];

/* =========================================================
   FAQ
========================================================= */

const FAQ = [
  {
    q: "Buyurtmamni qanday kuzatishim mumkin?",
    a: "«Buyurtmalarim» sahifasida har bir buyurtmangizning holatini kuzatishingiz mumkin. Yetkazib berish boshlanganida sizga bildirishnoma yuboriladi.",
  },
  {
    q: "Ulgurji chegirmalar qanday ishlaydi?",
    a: "Buyurtma hajmi ortishi bilan chegirma miqdori ham ortadi. Maxsus aksiyalar va shaxsiy takliflar haqida bildirishnomalar orqali xabardor bo'lasiz.",
  },
  {
    q: "Buyurtmani bekor qilish yoki qaytarish mumkinmi?",
    a: "Yetkazib berish boshlanmaguncha buyurtmani bekor qilish mumkin. Mahsulotni qabul qilgandan so'ng 14 kun ichida qaytarishingiz mumkin.",
  },
  {
    q: "To'lov qanday usullar bilan amalga oshiriladi?",
    a: "Bank kartasi, naqd pul va rasmiy hisob-faktura orqali to'lash mumkin. Barcha to'lovlar xavfsiz va himoyalangan.",
  },
  {
    q: "Qo'llab-quvvatlash xizmati bilan qanday bog'lanish mumkin?",
    a: "«Xabarlar» bo'limidagi onlayn chat, telefon yoki elektron pochta orqali istalgan vaqtda bog'lanishingiz mumkin. 24/7 ishlaymiz.",
  },
];

/* =========================================================
   PRESENTATIONAL COMPONENTS
========================================================= */

function StatusBadge({ status }) {
  const meta = STATUS[status] || STATUS.kutilmoqda;
  const Icon = meta.icon;
  return (
    <span className={`db-badge db-badge-${meta.tone}`}>
      <Icon />
      {meta.label}
    </span>
  );
}

function Skeleton({ className = "", style = {} }) {
  return (
    <span
      className={`db-skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

function EmptyState({ icon, title, text, action }) {
  return (
    <div className="db-empty">
      <div className="db-empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

function ToastStack({ toasts, dismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="db-toasts" aria-live="polite">
      {toasts.map((toast) => {
        const Icon =
          toast.type === "success"
            ? FaCheckCircle
            : toast.type === "error"
              ? FaExclamationTriangle
              : FaInfoCircle;
        return (
          <div className={`db-toast db-toast-${toast.type}`} key={toast.id}>
            <span className="db-toast-icon">
              <Icon />
            </span>
            <div className="db-toast-body">
              <strong>{toast.title}</strong>
              {toast.message && <p>{toast.message}</p>}
            </div>
            <button
              className="db-toast-close"
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
    <div className="db-modal" role="dialog" aria-modal="true">
      <div className="db-modal-backdrop" onClick={onCancel} />
      <div className={`db-confirm ${data.danger ? "db-confirm-danger" : ""}`}>
        <div className="db-confirm-icon">
          {data.danger ? <FaExclamationTriangle /> : <FaExclamationCircle />}
        </div>
        <h3>{data.title}</h3>
        <p>{data.text}</p>
        <div className="db-confirm-actions">
          <button className="db-btn db-btn-ghost" onClick={onCancel}>
            Bekor qilish
          </button>
          <button
            className={`db-btn ${data.danger ? "db-btn-danger" : "db-btn-primary"}`}
            onClick={onConfirm}
          >
            {data.confirmLabel || "Tasdiqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD PAGE
========================================================= */

export default function DashboardPage() {
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

  const [cart, setCart] = useState(getCart());
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(true);
  const [favRemoved, setFavRemoved] = useState(() =>
    loadJSON(FAV_REMOVED_KEY, [])
  );

  const [notifications, setNotifications] = useState(() =>
    loadJSON(NOTIF_KEY, NOTIFICATIONS_DEFAULT)
  );
  const [notifFilter, setNotifFilter] = useState("all");

  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [orderMonth, setOrderMonth] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [settingsTab, setSettingsTab] = useState("account");
  const [settings, setSettings] = useState({
    name: USER.name,
    email: USER.email,
    phone: USER.phone,
    address: USER.address,
    bio: USER.bio,
    twoFactor: true,
    notifEmail: true,
    notifSms: false,
    notifPush: true,
    publicProfile: true,
    showActivity: true,
    cookies: true,
    language: localStorage.getItem("language") || "uz",
    theme: "light",
  });

  const [messages, setMessages] = useState(CONVERSATIONS);
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0].id);
  const [chatDraft, setChatDraft] = useState("");

  const [openFaq, setOpenFaq] = useState(0);
  const [headerQuery, setHeaderQuery] = useState("");
  const [ticket, setTicket] = useState({ subject: "", message: "" });

  const chatEndRef = useRef(null);

  /* =========================
     THEME SAVE
  ========================= */

  useEffect(() => {
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  /* =========================
     INITIAL LOADING
  ========================= */

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  /* =========================
     CART SYNC
  ========================= */

  useEffect(() => {
    const onCartUpdate = () => setCart(getCart());
    window.addEventListener("cart-updated", onCartUpdate);
    return () => window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

  /* =========================
     LOAD FAVORITES
  ========================= */

  useEffect(() => {
    let cancelled = false;

(async () => {
        try {
          const data = await getProducts();
          const list = data.data?.items ?? data.data ?? [];
          if (!cancelled) setFavorites(Array.isArray(list) ? list : []);
        } catch {
          if (!cancelled) setFavorites(MOCK_PRODUCTS);
        } finally {
          if (!cancelled) setFavLoading(false);
        }
      })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================
     NOTIFICATIONS SAVE
  ========================= */

  useEffect(() => {
    saveJSON(NOTIF_KEY, notifications);
  }, [notifications]);

  /* =========================
     SCROLL CHAT TO BOTTOM
  ========================= */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, messages]);

  /* =========================
     DERIVED DATA
  ========================= */

  const shownFavorites = favorites.filter(
    (product) => !favRemoved.includes(product.id)
  );

  const unreadCount = notifications.filter((item) => !item.read).length;

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartShipping = cart.length ? 15000 : 0;
  const cartTotal = cartSubtotal + cartShipping;

  const orderMonths = useMemo(() => {
    const map = new Map();
    ORDERS.forEach((order) => map.set(order.date.slice(0, 7), order.date.slice(0, 7)));
    return [...map.keys()];
  }, []);

  const filteredOrders = useMemo(() => {
    const q = orderQuery.trim().toLowerCase();
    return ORDERS.filter((order) => {
      const matchQuery =
        !q ||
        order.number.toLowerCase().includes(q) ||
        order.items.some((item) => item.name.toLowerCase().includes(q));
      const matchStatus =
        orderStatus === "all" || order.status === orderStatus;
      const matchMonth =
        orderMonth === "all" || order.date.startsWith(orderMonth);
      return matchQuery && matchStatus && matchMonth;
    });
  }, [orderQuery, orderStatus, orderMonth]);

  const filteredNotifications = useMemo(() => {
    if (notifFilter === "all") return notifications;
    if (notifFilter === "unread") return notifications.filter((item) => !item.read);
    return notifications.filter((item) => item.type === notifFilter);
  }, [notifications, notifFilter]);

  const headerResults = useMemo(() => {
    const q = headerQuery.trim().toLowerCase();
    if (!q) return [];
    return ORDERS.filter(
      (order) =>
        order.number.toLowerCase().includes(q) ||
        order.items.some((item) => item.name.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [headerQuery]);

  const stats = {
    orders: ORDERS.length,
    active: ORDERS.filter((o) => o.status === "jarayonda" || o.status === "kutilmoqda")
      .length,
    favorites: shownFavorites.length,
    spending: ORDERS.filter((o) => o.status !== "bekor_qilindi").reduce(
      (sum, o) => sum + o.total,
      0
    ),
  };

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

  function toggleFavorite(id) {
    setFavRemoved((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveJSON(FAV_REMOVED_KEY, next);
      return next;
    });
    pushToast(
      favRemoved.includes(id) ? "success" : "info",
      favRemoved.includes(id) ? "Sevimlilarga qo'shildi" : "Sevimlilardan olib tashlandi"
    );
  }

  function addFavoriteToCart(product) {
    addToCart(product);
    pushToast("success", "Savatga qo'shildi", `"${product.title}"`);
  }

  function changeQty(id, size, delta) {
    const item = cart.find((c) => c.id === id && c.size === size);
    if (item) updateQuantity(id, size, item.quantity + delta);
  }

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

  function openOrder(order) {
    setOrderQuery(order.number);
    setExpandedOrder(order.id);
    go("orders");
  }

  function handleLogout() {
    askConfirm({
      danger: true,
      title: "Tizimdan chiqish",
      text: "Hisobingizdan chiqmoqchimisiz? Barcha o'zgarishlar saqlanadi.",
      confirmLabel: "Chiqish",
      action: () => navigate("/"),
    });
  }

  function handleDeleteAccount() {
    askConfirm({
      danger: true,
      title: "Hisobni o'chirish",
      text: "Hisobingiz va barcha ma'lumotlaringiz butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi!",
      confirmLabel: "Hisobni o'chirish",
      action: () => {
        pushToast("success", "Hisob o'chirish so'rovi yuborildi");
      },
    });
  }

  function handleCancelOrder(order) {
    askConfirm({
      danger: true,
      title: "Buyurtmani bekor qilish",
      text: `${order.number} buyurtmasini bekor qilmoqchimisiz?`,
      confirmLabel: "Bekor qilish",
      action: () => pushToast("success", "Buyurtma bekor qilindi", order.number),
    });
  }

  function handleSettingsSave() {
    pushToast("success", "Sozlamalar saqlandi");
  }

  /* =========================
     NAV DATA
  ========================= */

  const NAV = [
    { id: "dashboard", label: "Boshqaruv paneli", icon: <FaColumns /> },
    { id: "profile", label: "Mening profilim", icon: <FaUser /> },
    { id: "orders", label: "Buyurtmalarim", icon: <FaBoxOpen /> },
    { id: "favorites", label: "Sevimlilar", icon: <FaHeart /> },
    { id: "cart", label: "Savat", icon: <FaShoppingCart /> },
    { id: "messages", label: "Xabarlar", icon: <FaEnvelope /> },
    { id: "notifications", label: "Bildirishnomalar", icon: <FaBell /> },
    { id: "settings", label: "Sozlamalar", icon: <FaCog /> },
    { id: "help", label: "Yordam va qo'llab-quvvatlash", icon: <FaQuestionCircle /> },
  ];

  const sectionTitle =
    NAV.find((item) => item.id === section)?.label || "Boshqaruv paneli";

  /* =========================================================
     SECTIONS
  ========================================================= */

  function renderDashboard() {
    const statCards = [
      {
        label: "Buyurtmalar",
        value: stats.orders,
        icon: <FaShoppingBag />,
        tone: "primary",
        trend: "+3 bu oy",
        up: true,
      },
      {
        label: "Jarayondagi buyurtmalar",
        value: stats.active,
        icon: <FaClock />,
        tone: "warning",
        trend: "2 kutilmoqda",
        up: null,
      },
      {
        label: "Sevimlilar",
        value: stats.favorites,
        icon: <FaHeart />,
        tone: "danger",
        trend: "+5 bu hafta",
        up: true,
      },
      {
        label: "Umumiy xarajat",
        value: formatSum(stats.spending),
        icon: <FaMoneyBillWave />,
        tone: "success",
        trend: "+12.5%",
        up: true,
      },
    ];

    const recent = ORDERS.slice(0, 6);
    const quickActions = [
      { label: "Yangi buyurtma", icon: <FaShoppingBag />, target: "orders", tint: "primary" },
      { label: "Sevimlilarni ko'rish", icon: <FaHeart />, target: "favorites", tint: "danger" },
      { label: "Savatga o'tish", icon: <FaShoppingCart />, target: "cart", tint: "warning" },
      { label: "Yordam olish", icon: <FaHeadset />, target: "help", tint: "success" },
    ];

    const activity = [
      { label: "Dushanba", value: 42 },
      { label: "Seshanba", value: 65 },
      { label: "Chorshanba", value: 38 },
      { label: "Payshanba", value: 80 },
      { label: "Juma", value: 54 },
      { label: "Shanba", value: 90 },
      { label: "Yakshanba", value: 30 },
    ];

    return (
      <div className="db-section db-dashboard">
        <div className="db-greet">
          <div>
            <h1>Xush kelibsiz, {USER.firstName}!</h1>
            <p>
              Bugun — {formatDate("2026-08-18")}. Hisobingizdagi so'nggi faoliyatni ko'rib chiqing.
            </p>
          </div>
          <Link to="/shop" className="db-btn db-btn-primary db-greet-cta">
            Do'konga o'tish <FaArrowRight />
          </Link>
        </div>

        <div className="db-stats">
          {statCards.map((card) => (
            <div className="db-stat" key={card.label}>
              <span className={`db-stat-icon db-stat-${card.tone}`}>
                {card.icon}
              </span>
              <div className="db-stat-info">
                <span className="db-stat-label">{card.label}</span>
                <strong>{card.value}</strong>
                {card.trend && (
                  <span
                    className={`db-stat-trend ${card.up ? "db-trend-up" : ""} ${
                      card.up === false ? "db-trend-down" : ""
                    }`}
                  >
                    {card.up === true && "▲ "}
                    {card.up === false && "▼ "}
                    {card.trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="db-dash-grid">
          <div className="db-card db-card-table">
            <div className="db-card-head">
              <div>
                <h2>So'nggi buyurtmalar</h2>
                <p>Oxirgi 6 ta buyurtma</p>
              </div>
              <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => go("orders")}>
                Barchasi <FaChevronRight />
              </button>
            </div>

            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Buyurtma ID</th>
                    <th>Mahsulot</th>
                    <th>Sana</th>
                    <th>Summa</th>
                    <th>Holat</th>
                    <th className="db-ta-right">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link
                          to="#"
                          className="db-order-id"
                          onClick={(e) => {
                            e.preventDefault();
                            openOrder(order);
                          }}
                        >
                          {order.number}
                        </Link>
                      </td>
                      <td>
                        <div className="db-cell-product">
                          <img src={order.items[0].image} alt={order.items[0].name} />
                          <div>
                            <strong>{order.items[0].name}</strong>
                            <span>
                              {order.items.length} ta mahsulot
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="db-muted">{formatDate(order.date)}</td>
                      <td className="db-strong">{formatSum(order.total)}</td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="db-ta-right">
                        <button
                          className="db-icon-btn db-icon-btn-ghost"
                          onClick={() => openOrder(order)}
                          aria-label="Batafsil"
                          title="Batafsil"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="db-side-col">
            <div className="db-card">
              <div className="db-card-head">
                <div>
                  <h2>Tezkor amallar</h2>
                  <p>Odatda ishlatiladigan bo'limlar</p>
                </div>
              </div>
              <div className="db-quick-actions">
                {quickActions.map((action) => (
                  <button
                    className="db-quick"
                    key={action.label}
                    onClick={() => go(action.target)}
                  >
                    <span className={`db-quick-icon db-stat-${action.tint}`}>
                      {action.icon}
                    </span>
                    <span>
                      <strong>{action.label}</strong>
                      <small>Bo'limga o'tish</small>
                    </span>
                    <FaChevronRight className="db-quick-arrow" />
                  </button>
                ))}
              </div>
            </div>

            <div className="db-card">
              <div className="db-card-head">
                <div>
                  <h2>Faoliyat</h2>
                  <p>Haftalik buyurtmalar</p>
                </div>
                <span className="db-chip db-chip-success">Aktiv</span>
              </div>
              <div className="db-chart">
                {activity.map((day) => (
                  <div className="db-chart-col" key={day.label}>
                    <div className="db-chart-track">
                      <span
                        className="db-chart-bar"
                        style={{ height: `${day.value}%` }}
                      />
                    </div>
                    <small>{day.label.slice(0, 3)}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     PROFILE
  ========================= */

  function renderProfile() {
    return (
      <div className="db-section db-profile">
        <div className="db-profile-grid">
          <div className="db-card db-profile-card">
            <div className="db-profile-cover" />
            <div className="db-profile-avatar">
              <span>{USER.firstName[0]}{USER.name.split(" ")[1][0]}</span>
              <button
                className="db-avatar-edit"
                title="Rasmni o'zgartirish"
                onClick={() =>
                  pushToast("info", "Avatar yangilanmoqda", "Yangi rasm tanlash oynasi ochiladi")
                }
              >
                <FaCamera />
              </button>
            </div>
            <div className="db-profile-heading">
              <h2>{USER.name}</h2>
              <span className="db-chip db-chip-primary">
                <FaCheck /> {USER.role}
              </span>
            </div>
            <p className="db-profile-bio">{USER.bio}</p>

            <div className="db-profile-stats">
              <div>
                <strong>{stats.orders}</strong>
                <span>Buyurtma</span>
              </div>
              <div>
                <strong>{stats.favorites}</strong>
                <span>Sevimli</span>
              </div>
              <div>
                <strong>{formatSum(stats.spending).replace(" so'm", "")}</strong>
                <span>Xarajat</span>
              </div>
            </div>

            <div className="db-profile-actions">
              <button
                className="db-btn db-btn-primary"
                onClick={() => {
                  setSettingsTab("account");
                  go("settings");
                }}
              >
                <FaEdit /> Profilni tahrirlash
              </button>
              <button
                className="db-btn db-btn-ghost"
                onClick={() => {
                  setSettingsTab("security");
                  go("settings");
                }}
              >
                <FaLock /> Parolni o'zgartirish
              </button>
            </div>
          </div>

          <div className="db-card db-info-card">
            <div className="db-card-head">
              <div>
                <h2>Shaxsiy ma'lumotlar</h2>
                <p>Hisobingiz haqidagi asosiy ma'lumotlar</p>
              </div>
            </div>
            <div className="db-info-list">
              <div className="db-info-item">
                <span className="db-info-icon">
                  <FaPhoneAlt />
                </span>
                <div>
                  <small>Telefon raqam</small>
                  <strong>{USER.phone}</strong>
                </div>
              </div>
              <div className="db-info-item">
                <span className="db-info-icon">
                  <FaEnvelope />
                </span>
                <div>
                  <small>Elektron pochta</small>
                  <strong>{USER.email}</strong>
                </div>
              </div>
              <div className="db-info-item">
                <span className="db-info-icon">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <small>Manzil</small>
                  <strong>{USER.address}</strong>
                </div>
              </div>
              <div className="db-info-item">
                <span className="db-info-icon">
                  <FaCalendarAlt />
                </span>
                <div>
                  <small>Ro'yxatdan o'tgan sana</small>
                  <strong>{USER.registered}</strong>
                </div>
              </div>
            </div>
            <div className="db-card-foot">
              <button
                className="db-btn db-btn-ghost db-btn-sm"
                onClick={handleSettingsSave}
              >
                <FaDownload /> Ma'lumotlarni eksport qilish
              </button>
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
    return (
      <div className="db-section db-orders">
        <div className="db-card db-filters">
          <div className="db-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Buyurtma ID yoki mahsulot qidirish..."
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
            />
            {orderQuery && (
              <button onClick={() => setOrderQuery("")} aria-label="Tozalash">
                <FaTimes />
              </button>
            )}
          </div>

          <div className="db-select-box">
            <FaFilter />
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              aria-label="Holat bo'yicha filtrlash"
            >
              <option value="all">Barcha holatlar</option>
              <option value="yetkazildi">Yetkazildi</option>
              <option value="jarayonda">Jarayonda</option>
              <option value="kutilmoqda">Kutilmoqda</option>
              <option value="bekor_qilindi">Bekor qilindi</option>
            </select>
          </div>

          <div className="db-select-box">
            <FaCalendarAlt />
            <select
              value={orderMonth}
              onChange={(e) => setOrderMonth(e.target.value)}
              aria-label="Sana bo'yicha filtrlash"
            >
              <option value="all">Barcha sanalar</option>
              {orderMonths.map((month) => (
                <option key={month} value={month}>
                  {monthLabel(month)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="db-orders-summary">
          <p>
            <strong>{filteredOrders.length}</strong> ta buyurtma topildi
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="db-card">
            <EmptyState
              icon={<FaBoxOpen />}
              title="Buyurtmalar topilmadi"
              text="Filtrlarni o'zgartirib qayta qidirib ko'ring yoki do'kondan yangi mahsulot tanlang."
              action={
                <Link to="/shop" className="db-btn db-btn-primary">
                  Do'konga o'tish
                </Link>
              }
            />
          </div>
        ) : (
          <div className="db-orders-list">
            {filteredOrders.map((item) => {
              const isOpen = expandedOrder === item.id;
              return (
                <div
                  className={`db-order-card ${isOpen ? "db-order-open" : ""}`}
                  key={item.id}
                >
                  <div className="db-order-main">
                    <div className="db-order-head">
                      <div className="db-order-id-title">
                        <strong>{item.number}</strong>
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="db-order-products">
                      {item.items.map((product) => (
                        <div className="db-order-product" key={product.name}>
                          <img src={product.image} alt={product.name} />
                          <div>
                            <strong>{product.name}</strong>
                            <span>
                              {product.category} • {product.qty} dona
                            </span>
                          </div>
                          <b>{formatSum(product.price * product.qty)}</b>
                        </div>
                      ))}
                    </div>

                    <div className="db-order-foot">
                      <div className="db-order-meta">
                        <span>
                          <FaCreditCard /> {item.payment}
                        </span>
                        <span>
                          <FaTruck /> {item.delivery}
                        </span>
                      </div>
                      <div className="db-order-total">
                        <span>Jami:</span>
                        <strong>{formatSum(item.total)}</strong>
                      </div>
                    </div>

                    <div className="db-order-actions">
                      <button
                        className="db-btn db-btn-ghost db-btn-sm"
                        onClick={() =>
                          setExpandedOrder(isOpen ? null : item.id)
                        }
                      >
                        <FaEye /> {isOpen ? "Yopish" : "Batafsil"}
                      </button>
                      {(item.status === "jarayonda" ||
                        item.status === "kutilmoqda") && (
                        <button
                          className="db-btn db-btn-danger-soft db-btn-sm"
                          onClick={() => handleCancelOrder(item)}
                        >
                          <FaTrashAlt /> Bekor qilish
                        </button>
                      )}
                      {item.status === "yetkazildi" && (
                        <button
                          className="db-btn db-btn-primary db-btn-sm"
                          onClick={() =>
                            pushToast("success", "Rahmat!", "Fikringiz uchun 50 bonus oltinga ega bo'ldingiz")
                          }
                        >
                          <FaStar /> Fikr bildirish
                        </button>
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="db-order-details">
                      <h3>Buyurtma tafsilotlari</h3>
                      <div className="db-detail-grid">
                        <div className="db-detail-item">
                          <small>Buyurtma raqami</small>
                          <strong>{item.number}</strong>
                        </div>
                        <div className="db-detail-item">
                          <small>Sana</small>
                          <strong>{formatDate(item.date)}</strong>
                        </div>
                        <div className="db-detail-item">
                          <small>To'lov usuli</small>
                          <strong>{item.payment}</strong>
                        </div>
                        <div className="db-detail-item">
                          <small>Yetkazib berish</small>
                          <strong>{item.delivery}</strong>
                        </div>
                        <div className="db-detail-item">
                          <small>Mahsulotlar soni</small>
                          <strong>
                            {item.items.reduce((sum, p) => sum + p.qty, 0)} dona
                          </strong>
                        </div>
                        <div className="db-detail-item">
                          <small>Umumiy summa</small>
                          <strong>{formatSum(item.total)}</strong>
                        </div>
                      </div>
                      <div className="db-order-track">
                        {[
                          { label: "Buyurtma qabul qilindi", done: true },
                          { label: "Tayyorlanmoqda", done: item.status !== "kutilmoqda" },
                          { label: "Yetkazilmoqda", done: item.status === "jarayonda" || item.status === "yetkazildi" },
                          { label: "Yetkazildi", done: item.status === "yetkazildi" },
                        ].map((step, index) => (
                          <div
                            className={`db-track-step ${step.done ? "db-track-done" : ""}`}
                            key={step.label}
                          >
                            <span className="db-track-dot">
                              {step.done ? <FaCheck /> : <span>{index + 1}</span>}
                            </span>
                            <p>{step.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* =========================
     FAVORITES
  ========================= */

  function renderFavorites() {
    return (
      <div className="db-section db-favorites">
        <div className="db-card-head db-section-head">
          <div>
            <h2>Sevimli mahsulotlar</h2>
            <p>
              {shownFavorites.length} ta mahsulot saqlangan
            </p>
          </div>
          <Link to="/shop" className="db-btn db-btn-ghost db-btn-sm">
            Mahsulotlar <FaArrowRight />
          </Link>
        </div>

        {favLoading ? (
          <div className="db-fav-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="db-product-card db-card" key={index}>
                <Skeleton className="db-fav-img-skel" />
                <div className="db-product-info">
                  <Skeleton style={{ width: "40%", height: 12 }} />
                  <Skeleton style={{ width: "80%", height: 16 }} />
                  <Skeleton style={{ width: "50%", height: 14 }} />
                </div>
              </div>
            ))}
          </div>
        ) : shownFavorites.length === 0 ? (
          <div className="db-card">
            <EmptyState
              icon={<FaHeart />}
              title="Sevimlilar bo'sh"
              text="Yoqqan mahsulotlarni yuragingizga bosib saqlang va ular shu yerda ko'rinadi."
              action={
                <Link to="/shop" className="db-btn db-btn-primary">
                  Mahsulotlarni ko'rish
                </Link>
              }
            />
          </div>
        ) : (
          <div className="db-fav-grid">
            {shownFavorites.map((product) => {
              const favId = product.id ?? product.title;
              return (
                <div className="db-product-card db-card" key={favId}>
                  <div className="db-product-image">
                    <img
                      src={product.image_url || product.image}
                      alt={product.title}
                      onError={(e) => {
                        e.currentTarget.src = IMG.shirt;
                      }}
                    />
                    <button
                      className="db-heart db-heart-active"
                      onClick={() => toggleFavorite(favId)}
                      title="Sevimlilardan olib tashlash"
                      aria-label="Sevimlilardan olib tashlash"
                    >
                      <FaHeart />
                    </button>
                  </div>
                  <div className="db-product-info">
                    <span className="db-product-cat">{product.category}</span>
                    <h3>{product.title}</h3>
                    <div className="db-product-rating">
                      <FaStar />
                      <span>{(product.rating ?? 4.5).toFixed(1)}</span>
                    </div>
                    <strong className="db-product-price">
                      {formatSum(product.wholesale_price ?? product.price)}
                    </strong>
                    <div className="db-product-btns">
                      <button
                        className="db-btn db-btn-primary db-btn-sm"
                        onClick={() => addFavoriteToCart(product)}
                      >
                        <FaShoppingCart /> Savatga
                      </button>
                      <button
                        className="db-btn db-btn-danger-soft db-btn-sm"
                        onClick={() => toggleFavorite(favId)}
                      >
                        <FaTrashAlt /> O'chirish
                      </button>
                    </div>
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
     CART
  ========================= */

  function renderCart() {
    return (
      <div className="db-section db-cart">
        <div className="db-cart-grid">
          <div className="db-cart-items">
            {cart.length === 0 ? (
              <div className="db-card">
                <EmptyState
                  icon={<FaShoppingCart />}
                  title="Savingiz bo'sh"
                  text="Hozircha hech qanday mahsulot qo'shilmagan. Do'kondan yoqqan mahsulotlarni tanlang."
                  action={
                    <Link to="/shop" className="db-btn db-btn-primary">
                      Do'konga o'tish
                    </Link>
                  }
                />
              </div>
            ) : (
              cart.map((item) => (
                <div className="db-cart-item db-card" key={`${item.id}-${item.size}`}>
                  <img src={item.image} alt={item.title} />
                  <div className="db-cart-info">
                    <h3>{item.title}</h3>
                    <span className="db-product-cat">
                      {item.category}
                      {item.size ? ` • O'lcham: ${item.size}` : ""}
                    </span>
                    <strong>{formatSum(item.price)}</strong>
                  </div>
                  <div className="db-qty">
                    <button
                      onClick={() => changeQty(item.id, item.size, -1)}
                      aria-label="Kamaytirish"
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => changeQty(item.id, item.size, 1)}
                      aria-label="Oshirish"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <b className="db-cart-line-total">
                    {formatSum(item.price * item.quantity)}
                  </b>
                  <button
                    className="db-icon-btn db-icon-btn-danger"
                    onClick={() => removeFromCart(item.id, item.size)}
                    title="O'chirish"
                    aria-label="O'chirish"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="db-card db-cart-summary">
            <h2>Buyurtma xulosasi</h2>
            <div className="db-summary-row">
              <span>Mahsulotlar</span>
              <strong>{formatSum(cartSubtotal)}</strong>
            </div>
            <div className="db-summary-row">
              <span>Yetkazib berish</span>
              <strong>{cart.length ? formatSum(cartShipping) : "—"}</strong>
            </div>
            <div className="db-summary-row db-summary-total">
              <span>Jami</span>
              <strong>{formatSum(cartTotal)}</strong>
            </div>
            <Link
              to="/savat"
              className="db-btn db-btn-primary db-btn-block"
            >
              <FaCreditCard /> Rasmiylashtirishga o'tish
            </Link>
            <button
              className="db-btn db-btn-ghost db-btn-block"
              onClick={() => pushToast("info", "Tez orada", "Tez buyurtma funksiyasi ishlab chiqilmoqda")}
            >
              <FaTruck /> Tez buyurtma berish
            </button>
          </div>
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
      <div className="db-section db-messages">
        <div
          className={`db-messages-panel db-card ${
            activeChat ? "db-chat-thread-open" : ""
          }`}
        >
          <div className="db-chat-list">
            <div className="db-chat-list-head">
              <h2>Xabarlar</h2>
              <span className="db-chip db-chip-primary">
                {messages.reduce((sum, conv) => sum + conv.unread, 0)} yangi
              </span>
            </div>
            {messages.map((conv) => (
              <button
                className={`db-chat-item ${
                  activeChat === conv.id ? "db-chat-active" : ""
                }`}
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
              >
                <span className="db-chat-avatar">
                  {conv.name[0]}
                  <i className={conv.online ? "db-online" : ""} />
                </span>
                <span className="db-chat-meta">
                  <strong>{conv.name}</strong>
                  <small>{conv.role}</small>
                  <p>{conv.messages[conv.messages.length - 1].text}</p>
                </span>
                <span className="db-chat-side">
                  <small>{conv.messages[conv.messages.length - 1].time}</small>
                  {conv.unread > 0 && <i className="db-unread-dot" />}
                </span>
              </button>
            ))}
          </div>

          <div className="db-chat-thread">
            <div className="db-chat-thread-head">
              <button
                className="db-chat-back"
                onClick={() => setActiveChat(null)}
                aria-label="Orqaga"
              >
                <FaArrowLeft />
              </button>
              <span className="db-chat-avatar db-chat-avatar-lg">
                {conversation.name[0]}
                <i className={conversation.online ? "db-online" : ""} />
              </span>
              <div className="db-chat-thread-title">
                <strong>{conversation.name}</strong>
                <small>{conversation.role}</small>
              </div>
              <button className="db-icon-btn db-icon-btn-ghost" aria-label="Ko'proq">
                <FaEllipsisV />
              </button>
            </div>

            <div className="db-chat-body">
              {conversation.messages.map((message) => (
                <div
                  className={`db-msg ${message.from === "me" ? "db-msg-me" : "db-msg-them"}`}
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

            <div className="db-chat-input">
              <input
                type="text"
                placeholder="Xabar yozing..."
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button onClick={sendMessage} aria-label="Yuborish" title="Yuborish">
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
    const filters = [
      { id: "all", label: "Barchasi" },
      { id: "unread", label: "O'qilmagan" },
      { id: "order", label: "Buyurtma" },
      { id: "promo", label: "Aksiyalar" },
      { id: "system", label: "Tizim" },
    ];

    const typeMeta = {
      order: { icon: <FaBoxOpen />, tone: "primary" },
      status: { icon: <FaTruck />, tone: "success" },
      promo: { icon: <FaFire />, tone: "danger" },
      system: { icon: <FaShieldAlt />, tone: "info" },
    };

    return (
      <div className="db-section db-notifications">
        <div className="db-card-head db-section-head">
          <div>
            <h2>Bildirishnomalar</h2>
            <p>
              {unreadCount > 0
                ? `${unreadCount} ta o'qilmagan bildirishnoma`
                : "Barcha bildirishnomalar o'qilgan"}
            </p>
          </div>
          <button
            className="db-btn db-btn-ghost db-btn-sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <FaCheckDouble /> Barchasini o'qilgan qilish
          </button>
        </div>

        <div className="db-notif-tabs">
          {filters.map((filter) => (
            <button
              className={`db-tab ${notifFilter === filter.id ? "db-tab-active" : ""}`}
              key={filter.id}
              onClick={() => setNotifFilter(filter.id)}
            >
              {filter.label}
              {filter.id === "unread" && unreadCount > 0 && (
                <span className="db-tab-count">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="db-card">
            <EmptyState
              icon={<FaBell />}
              title="Bildirishnomalar yo'q"
              text="Bu bo'limda hech qanday bildirishnoma topilmadi."
            />
          </div>
        ) : (
          <div className="db-notif-list">
            {filteredNotifications.map((item) => {
              const meta = typeMeta[item.type] || typeMeta.system;
              return (
                <div
                  className={`db-notif ${item.read ? "" : "db-notif-unread"}`}
                  key={item.id}
                >
                  <span className={`db-notif-icon db-stat-${meta.tone}`}>
                    {meta.icon}
                  </span>
                  <div className="db-notif-body">
                    <div className="db-notif-title">
                      <strong>{item.title}</strong>
                      {!item.read && <i className="db-unread-dot" />}
                    </div>
                    <p>{item.text}</p>
                    <small>{item.time}</small>
                  </div>
                  <div className="db-notif-actions">
                    {!item.read && (
                      <button
                        className="db-icon-btn db-icon-btn-ghost"
                        onClick={() => markRead(item.id)}
                        title="O'qildi deb belgilash"
                        aria-label="O'qildi"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      className="db-icon-btn db-icon-btn-danger"
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
     SETTINGS
  ========================= */

  function renderSettings() {
    const tabs = [
      { id: "account", label: "Hisob ma'lumotlari", icon: <FaUser /> },
      { id: "profile", label: "Profil sozlamalari", icon: <FaUserCog /> },
      { id: "security", label: "Parol va xavfsizlik", icon: <FaKey /> },
      { id: "notifications", label: "Bildirishnomalar", icon: <FaBell /> },
      { id: "language", label: "Til", icon: <FaGlobe /> },
      { id: "theme", label: "Mavzu", icon: <FaMoon /> },
      { id: "privacy", label: "Maxfiylik", icon: <FaShieldAlt /> },
      { id: "danger", label: "Xavfli zona", icon: <FaExclamationTriangle /> },
    ];

    return (
      <div className="db-section db-settings">
        <div className="db-settings-layout">
          <div className="db-settings-nav db-card">
            {tabs.map((tab) => (
              <button
                className={`db-settings-tab ${
                  settingsTab === tab.id ? "db-settings-tab-active" : ""
                }`}
                key={tab.id}
                onClick={() => setSettingsTab(tab.id)}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="db-settings-content">
            <div className="db-card db-settings-panel">
              {settingsTab === "account" && (
                <>
                  <div className="db-card-head">
                    <div>
                      <h2>Hisob ma'lumotlari</h2>
                      <p>Shaxsiy ma'lumotlaringizni yangilang</p>
                    </div>
                  </div>
                  <div className="db-form-grid">
                    <div className="db-field">
                      <label>To'liq ism</label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) =>
                          setSettings({ ...settings, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="db-field">
                      <label>Elektron pochta</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) =>
                          setSettings({ ...settings, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="db-field">
                      <label>Telefon raqam</label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) =>
                          setSettings({ ...settings, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="db-field db-field-full">
                      <label>Yetkazib berish manzili</label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) =>
                          setSettings({ ...settings, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="db-settings-actions">
                    <button className="db-btn db-btn-primary" onClick={handleSettingsSave}>
                      O'zgarishlarni saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "profile" && (
                <>
                  <div className="db-card-head">
                    <div>
                      <h2>Profil sozlamalari</h2>
                      <p>Avatar va bio ma'lumotlaringiz</p>
                    </div>
                  </div>
                  <div className="db-form-grid">
                    <div className="db-field db-field-full">
                      <label>Avatar</label>
                      <div className="db-avatar-row">
                        <span className="db-settings-avatar">
                          {settings.name[0]}
                        </span>
                        <button
                          className="db-btn db-btn-ghost db-btn-sm"
                          onClick={() =>
                            pushToast("info", "Avatar", "Yangi rasm tanlashingiz mumkin")
                          }
                        >
                          <FaCamera /> Yangi rasm yuklash
                        </button>
                      </div>
                    </div>
                    <div className="db-field db-field-full">
                      <label>Bio</label>
                      <textarea
                        rows={4}
                        value={settings.bio}
                        onChange={(e) =>
                          setSettings({ ...settings, bio: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="db-settings-actions">
                    <button className="db-btn db-btn-primary" onClick={handleSettingsSave}>
                      Saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "security" && (
                <>
                  <div className="db-card-head">
                    <div>
                      <h2>Parol va xavfsizlik</h2>
                      <p>Hisobingizni himoya qiling</p>
                    </div>
                  </div>
                  <div className="db-form-grid">
                    <div className="db-field">
                      <label>Joriy parol</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <div className="db-field">
                      <label>Yangi parol</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <div className="db-field db-field-full">
                      <label>Yangi parolni tasdiqlang</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="db-toggle-row">
                    <div>
                      <strong>Ikki bosqichli tasdiqlash</strong>
                      <p>Kirishda qo'shimcha kod talab qilinadi</p>
                    </div>
                    <label className="db-switch">
                      <input
                        type="checkbox"
                        checked={settings.twoFactor}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            twoFactor: e.target.checked,
                          })
                        }
                      />
                      <span />
                    </label>
                  </div>
                  <div className="db-settings-actions">
                    <button className="db-btn db-btn-primary" onClick={handleSettingsSave}>
                      Parolni yangilash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "notifications" && (
                <>
                  <div className="db-card-head">
                    <div>
                      <h2>Bildirishnoma sozlamalari</h2>
                      <p>Qaysi bildirishnomalarni olishni tanlang</p>
                    </div>
                  </div>
                  <div className="db-toggle-list">
                    {[
                      {
                        key: "notifEmail",
                        title: "Elektron pochta",
                        text: "Buyurtmalar va aksiyalar haqida email orqali xabar berish",
                      },
                      {
                        key: "notifSms",
                        title: "SMS",
                        text: "Holat o'zgarishlari haqida SMS orqali xabar berish",
                      },
                      {
                        key: "notifPush",
                        title: "Push bildirishnomalar",
                        text: "Brauzer orqali real vaqt rejimida xabar berish",
                      },
                    ].map((item) => (
                      <div className="db-toggle-row" key={item.key}>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.text}</p>
                        </div>
                        <label className="db-switch">
                          <input
                            type="checkbox"
                            checked={settings[item.key]}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                [item.key]: e.target.checked,
                              })
                            }
                          />
                          <span />
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="db-settings-actions">
                    <button className="db-btn db-btn-primary" onClick={handleSettingsSave}>
                      Saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "language" && (
                <>
                  <div className="db-card-head">
                    <div>
                      <h2>Til</h2>
                      <p>Interfeys tilini tanlang</p>
                    </div>
                  </div>
                  <div className="db-language-grid">
                    {[
                      { id: "uz", label: "O'zbek", flag: "🇺🇿" },
                      { id: "ru", label: "Русский", flag: "🇷🇺" },
                      { id: "en", label: "English", flag: "🇬🇧" },
                      { id: "tr", label: "Türkçe", flag: "🇹🇷" },
                    ].map((lang) => (
                      <button
                        className={`db-lang-card ${
                          settings.language === lang.id ? "db-lang-active" : ""
                        }`}
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

              {settingsTab === "theme" && (
                <>
                  <div className="db-card-head">
                    <div>
                      <h2>Mavzu</h2>
                      <p>Ko'rinish uslubini tanlang</p>
                    </div>
                  </div>
                  <div className="db-theme-cards">
                    <button
                      className={`db-theme-card ${!dark ? "db-theme-active" : ""}`}
                      onClick={() => setDark(false)}
                    >
                      <span className="db-theme-preview db-theme-preview-light" />
                      <strong>
                        <FaSun /> Kunduzgi
                      </strong>
                    </button>
                    <button
                      className={`db-theme-card ${dark ? "db-theme-active" : ""}`}
                      onClick={() => setDark(true)}
                    >
                      <span className="db-theme-preview db-theme-preview-dark" />
                      <strong>
                        <FaMoon /> Tungi
                      </strong>
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "privacy" && (
                <>
                  <div className="db-card-head">
                    <div>
                      <h2>Maxfiylik</h2>
                      <p>Ma'lumotlaringizdan foydalanishni boshqaring</p>
                    </div>
                  </div>
                  <div className="db-toggle-list">
                    {[
                      {
                        key: "publicProfile",
                        title: "Ochiq profil",
                        text: "Profilingiz boshqa foydalanuvchilarga ko'rinadi",
                      },
                      {
                        key: "showActivity",
                        title: "Faoliyatni ko'rsatish",
                        text: "Sotib olish faoliyatingiz umumiy ko'rinishda aks etadi",
                      },
                      {
                        key: "cookies",
                        title: "Cookie fayllari",
                        text: "Sayt tajribasini yaxshilash uchun cookie ishlatiladi",
                      },
                    ].map((item) => (
                      <div className="db-toggle-row" key={item.key}>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.text}</p>
                        </div>
                        <label className="db-switch">
                          <input
                            type="checkbox"
                            checked={settings[item.key]}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                [item.key]: e.target.checked,
                              })
                            }
                          />
                          <span />
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="db-settings-actions">
                    <button className="db-btn db-btn-primary" onClick={handleSettingsSave}>
                      Saqlash
                    </button>
                  </div>
                </>
              )}

              {settingsTab === "danger" && (
                <>
                  <div className="db-card-head">
                    <div>
                      <h2>Xavfli zona</h2>
                      <p>Hisob bilan bog'liq xavfli amallar</p>
                    </div>
                  </div>
                  <div className="db-danger-zone">
                    <div className="db-danger-icon">
                      <FaExclamationTriangle />
                    </div>
                    <h3>Hisobni o'chirish</h3>
                    <p>
                      Hisobingiz o'chirilganda barcha buyurtmalar va shaxsiy
                      ma'lumotlar butunlay yo'qoladi. Bu amalni ortga qaytarib
                      bo'lmaydi.
                    </p>
                    <button
                      className="db-btn db-btn-danger"
                      onClick={handleDeleteAccount}
                    >
                      <FaTrashAlt /> Hisobni o'chirish
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

  /* =========================
     HELP
  ========================= */

  function renderHelp() {
    return (
      <div className="db-section db-help">
        <div className="db-help-grid">
          <div className="db-card db-faq">
            <div className="db-card-head">
              <div>
                <h2>Ko'p so'raladigan savollar</h2>
                <p>Tez-tez beriladigan savollarga javoblar</p>
              </div>
            </div>
            <div className="db-faq-list">
              {FAQ.map((item, index) => (
                <div
                  className={`db-faq-item ${
                    openFaq === index ? "db-faq-open" : ""
                  }`}
                  key={item.q}
                >
                  <button
                    className="db-faq-q"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{item.q}</span>
                    <FaChevronDown />
                  </button>
                  {openFaq === index && (
                    <div className="db-faq-a">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="db-help-side">
            <div className="db-card db-contact-card">
              <div className="db-card-head">
                <div>
                  <h2>Bog'lanish</h2>
                  <p>Savolingiz bo'lsa yozing</p>
                </div>
              </div>
              <div className="db-field">
                <label>Mavzu</label>
                <input
                  type="text"
                  placeholder="Savol mavzusi"
                  value={ticket.subject}
                  onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                />
              </div>
              <div className="db-field">
                <label>Xabar</label>
                <textarea
                  rows={4}
                  placeholder="Xabaringizni yozing..."
                  value={ticket.message}
                  onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                />
              </div>
              <button
                className="db-btn db-btn-primary db-btn-block"
                onClick={() => {
                  if (!ticket.subject.trim() || !ticket.message.trim()) {
                    pushToast("error", "Xatolik", "Iltimos, barcha maydonlarni to'ldiring");
                    return;
                  }
                  setTicket({ subject: "", message: "" });
                  pushToast("success", "Yuborildi", "Savolingiz qabul qilindi. Tez orada javob beramiz.");
                }}
              >
                <FaPaperPlane /> Yuborish
              </button>
            </div>

            <div className="db-card db-support-channels">
              <h3>Boshqa kanallar</h3>
              <a href="tel:+998990924985" className="db-channel">
                <span className="db-stat-primary">
                  <FaPhoneAlt />
                </span>
                <div>
                  <strong>Telefon</strong>
                  <small>+998 99 092 49 85</small>
                </div>
              </a>
              <a href="mailto:support@premiumstore.uz" className="db-channel">
                <span className="db-stat-primary">
                  <FaEnvelope />
                </span>
                <div>
                  <strong>Elektron pochta</strong>
                  <small>support@premiumstore.uz</small>
                </div>
              </a>
              <button
                className="db-channel"
                onClick={() => {
                  setActiveChat(1);
                  go("messages");
                }}
              >
                <span className="db-stat-primary">
                  <FaRegComment />
                </span>
                <div>
                  <strong>Onlayn chat</strong>
                  <small>24/7 ishlaymiz</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  const profileMenuOpen = profileMenu;

  return (
    <div className={`dashboard ${dark ? "dark-mode" : ""}`}>
      {/* ============================= SIDEBAR ============================= */}
      <aside className={`db-sidebar ${drawer ? "db-sidebar-open" : ""}`}>
        <div className="db-sidebar-head">
          <Link to="/" className="db-brand" onClick={() => setDrawer(false)}>
            <span className="db-brand-mark">P</span>
            <span className="db-brand-text">
              Premium <b>Store</b>
            </span>
          </Link>
          <button
            className="db-sidebar-close"
            onClick={() => setDrawer(false)}
            aria-label="Yopish"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="db-nav">
          <p className="db-nav-label">Menyu</p>
          {NAV.map((item) => {
            const badge =
              item.id === "cart"
                ? cart.reduce((sum, c) => sum + c.quantity, 0)
                : item.id === "notifications"
                  ? unreadCount
                  : item.id === "messages"
                    ? messages.reduce((sum, conv) => sum + conv.unread, 0)
                    : 0;
            return (
              <button
                className={`db-nav-item ${
                  section === item.id ? "db-nav-active" : ""
                }`}
                key={item.id}
                onClick={() => go(item.id)}
              >
                <span className="db-nav-icon">{item.icon}</span>
                <span className="db-nav-text">{item.label}</span>
                {badge > 0 && <span className="db-nav-badge">{badge}</span>}
              </button>
            );
          })}

          <p className="db-nav-label db-nav-label-last">Hisob</p>
          <button
            className="db-nav-item db-nav-logout"
            onClick={handleLogout}
          >
            <span className="db-nav-icon">
              <FaSignOutAlt />
            </span>
            <span className="db-nav-text">Chiqish</span>
          </button>
        </nav>

        <div className="db-sidebar-user">
          <div className="db-sidebar-avatar">{USER.name[0]}</div>
          <div>
            <strong>{USER.name}</strong>
            <small>Premium a'zo</small>
          </div>
        </div>
      </aside>

      {drawer && (
        <div className="db-sidebar-overlay" onClick={() => setDrawer(false)} />
      )}

      {/* ============================= MAIN ============================= */}
      <div className="db-main">
        {/* HEADER */}
        <header className="db-header">
          <button
            className="db-burger"
            onClick={() => setDrawer(true)}
            aria-label="Menyu"
          >
            <FaBars />
          </button>

          <div className="db-header-title">
            <strong>{sectionTitle}</strong>
          </div>

          <div className="db-header-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Buyurtma yoki mahsulot qidirish..."
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              onFocus={() => setProfileMenu(false)}
            />
            {headerQuery && (
              <button
                onClick={() => setHeaderQuery("")}
                aria-label="Tozalash"
              >
                <FaTimes />
              </button>
            )}
            {headerResults.length > 0 && (
              <div className="db-header-results">
                {headerResults.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      openOrder(order);
                      setHeaderQuery("");
                    }}
                  >
                    <span className="db-header-result-icon">
                      <FaBoxOpen />
                    </span>
                    <span>
                      <strong>{order.number}</strong>
                      <small>
                        {order.items[0].name} • {formatSum(order.total)}
                      </small>
                    </span>
                    <FaChevronRight />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="db-header-right">
            <button
              className="db-header-icon db-theme-toggle"
              onClick={toggleDark}
              title={dark ? "Kunduzgi rejim" : "Tungi rejim"}
              aria-label="Rejimni almashtirish"
            >
              {dark ? <FaSun /> : <FaMoon />}
            </button>

            <button
              className="db-header-icon db-bell"
              onClick={() => go("notifications")}
              title="Bildirishnomalar"
              aria-label="Bildirishnomalar"
            >
              <FaBell />
              {unreadCount > 0 && <span className="db-bell-dot">{unreadCount}</span>}
            </button>

            <div className="db-profile-wrap">
              <button
                className="db-profile-btn"
                onClick={() => setProfileMenu((prev) => !prev)}
                aria-label="Profil menyusi"
              >
                <span className="db-header-avatar">{USER.name[0]}</span>
                <span className="db-profile-name">
                  <strong>{USER.firstName}</strong>
                  <small>{USER.role}</small>
                </span>
                <FaChevronDown className={profileMenuOpen ? "db-chevron-up" : ""} />
              </button>

              {profileMenuOpen && (
                <div className="db-dropdown">
                  <div className="db-dropdown-head">
                    <span className="db-dropdown-avatar">{USER.name[0]}</span>
                    <div>
                      <strong>{USER.name}</strong>
                      <small>{USER.email}</small>
                    </div>
                  </div>
                  <button onClick={() => go("profile")}>
                    <FaUser /> Mening profilim
                  </button>
                  <button onClick={() => go("orders")}>
                    <FaBoxOpen /> Buyurtmalarim
                  </button>
                  <button onClick={() => go("settings")}>
                    <FaCog /> Sozlamalar
                  </button>
                  <button
                    className="db-dropdown-danger"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="db-content">
          {loading ? (
            <div className="db-section">
              <div className="db-greet">
                <div>
                  <Skeleton style={{ width: 260, height: 30 }} />
                  <Skeleton style={{ width: 380, height: 14 }} />
                </div>
              </div>
              <div className="db-stats">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className="db-stat db-skel-stat" key={index}>
                    <Skeleton
                      style={{ width: 54, height: 54, borderRadius: 16 }}
                    />
                    <div>
                      <Skeleton style={{ width: 110, height: 12 }} />
                      <Skeleton style={{ width: 80, height: 22 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="db-dash-grid">
                <div className="db-card">
                  <Skeleton style={{ width: 180, height: 20 }} />
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div className="db-skel-row" key={index}>
                      <Skeleton style={{ width: "100%", height: 52 }} />
                    </div>
                  ))}
                </div>
                <div className="db-side-col">
                  <div className="db-card">
                    <Skeleton style={{ width: 150, height: 20 }} />
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div className="db-skel-row" key={index}>
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
              {section === "profile" && renderProfile()}
              {section === "orders" && renderOrders()}
              {section === "favorites" && renderFavorites()}
              {section === "cart" && renderCart()}
              {section === "messages" && renderMessages()}
              {section === "notifications" && renderNotifications()}
              {section === "settings" && renderSettings()}
              {section === "help" && renderHelp()}
            </>
          )}
        </main>
      </div>

      {/* ============================= MOBILE NAV ============================= */}
      <nav className="db-mobile-nav" aria-label="Mobil navigatsiya">
        {[
          NAV[0],
          NAV[2],
          NAV[3],
          NAV[6],
        ].map((item) => {
          const badge =
            item.id === "cart"
              ? cart.reduce((sum, c) => sum + c.quantity, 0)
              : item.id === "notifications"
                ? unreadCount
                : 0;
          const shortLabel = {
            dashboard: "Bosh sahifa",
            orders: "Buyurtma",
            favorites: "Sevimli",
            notifications: "Bildirish",
          }[item.id] || item.label;
          return (
            <button
              className={`db-mnav-item ${
                section === item.id ? "db-mnav-active" : ""
              }`}
              key={item.id}
              onClick={() => go(item.id)}
            >
              <span className="db-mnav-icon">
                {item.icon}
                {badge > 0 && <i>{badge}</i>}
              </span>
              <small>{shortLabel}</small>
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
    </div>
  );
}