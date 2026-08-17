const API_BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.detail || data.email || data.non_field_errors)) ||
      "Something went wrong";
    throw new Error(Array.isArray(message) ? message[0] : message);
  }

  return data;
}

export function getProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/products/${qs ? `?${qs}` : ""}`);
}

export function getProduct(id) {
  return request(`/products/${id}/`);
}

export function getCategories() {
  return request("/categories/");
}

export function getReviews() {
  return request("/reviews/");
}

export function subscribe(email) {
  return request("/subscribers/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function createOrder(order) {
  return request("/orders/", {
    method: "POST",
    body: JSON.stringify(order),
  });
}