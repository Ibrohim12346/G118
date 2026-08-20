export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MANAGER: "manager",
  SELLER: "seller",
};

export const ROLES_LIST = Object.values(ROLES);

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "processing",
  "shipping",
  "completed",
  "cancelled",
];

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

export const PRODUCT_STATUSES = ["active", "inactive", "out_of_stock"];