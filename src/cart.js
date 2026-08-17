const CART_KEY = "premium_store_cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(product, quantity = 1, size = "") {
  const items = getCart();
  const existing = items.find(
    (item) => item.id === product.id && item.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id: product.id,
      title: product.title,
      category: product.category,
      price: Number(
        product.wholesale_price ?? product.price
      ),
      image: product.image_url || product.image,
      size,
      quantity,
    });
  }

  saveCart(items);
}

export function updateQuantity(id, size, quantity) {
  const items = getCart().map((item) =>
    item.id === id && item.size === size
      ? { ...item, quantity: Math.max(1, quantity) }
      : item
  );
  saveCart(items);
}

export function removeFromCart(id, size) {
  saveCart(
    getCart().filter(
      (item) => !(item.id === id && item.size === size)
    )
  );
}

export function clearCart() {
  saveCart([]);
}