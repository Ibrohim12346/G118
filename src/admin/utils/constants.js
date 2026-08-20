export const ORDER_STATUS = {
  pending: { label: "Kutilmoqda", badge: "badge-amber" },
  confirmed: { label: "Tasdiqlangan", badge: "badge-blue" },
  shipped: { label: "Jo'natilgan", badge: "badge-violet" },
  delivered: { label: "Yetkazilgan", badge: "badge-green" },
  cancelled: { label: "Bekor qilingan", badge: "badge-red" },
};

export const ORDER_STATUS_KEYS = Object.keys(ORDER_STATUS);

export const ROLE_OPTIONS = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "seller", label: "Seller" },
];

export function formatMoney(value) {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}