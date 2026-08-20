export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function formatMoney(amount, currency = "so'm") {
  const value = Number(amount || 0);
  const formatted = new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(value);
  if (currency === "USD") return `$${formatted}`;
  if (currency === "EUR") return `${formatted} €`;
  if (currency === "RUB") return `${formatted} ₽`;
  return `${formatted} so'm`;
}

export function formatCompact(amount, currency = "so'm") {
  const value = Number(amount || 0);
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  }
  return String(value);
}

export function formatDate(iso, withTime = false) {
  if (!iso) return "—";
  const d = new Date(iso);
  const date = d.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (!withTime) return date;
  const time = d.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}

export function timeAgo(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "hozirgina";
  if (mins < 60) return `${mins} daqiqa oldin`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} kun oldin`;
  return formatDate(iso);
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const PALETTE = [
  ["#101014", "#3a3a44"],
  ["#0f0f16", "#2b2b38"],
  ["#16161d", "#40404c"],
  ["#1a1a22", "#4a4a58"],
];

export function placeholderImage(text = "", index = 0) {
  const [from, to] = PALETTE[index % PALETTE.length];
  const label = initials(text) || "OD";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><text x="50%" y="50%" dy=".35em" font-family="Segoe UI, Arial, sans-serif" font-size="120" font-weight="700" fill="rgba(255,255,255,.85)" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function hashId(seed) {
  let h = 0;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function isValidImage(url) {
  return /^(data:image|https?:\/\/)/i.test(url || "");
}