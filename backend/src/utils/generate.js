import crypto from "crypto";

export const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

export const generateOrderNumber = () => {
  const d = new Date();
  const yyyymmdd =
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ORD-${yyyymmdd}-${rand}`;
};