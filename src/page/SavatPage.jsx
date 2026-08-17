import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaTruck,
  FaCreditCard,
  FaLock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";

import "./SavatPage.css";

import { createOrder } from "../api.js";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../cart.js";

export default function SavatPage() {
  const [products, setProducts] = useState(getCart());

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    region: "",
    zip: "",
    phone: "",
  });

  const [payment, setPayment] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);

  useEffect(() => {
    const onCartUpdate = () => setProducts(getCart());
    window.addEventListener("cart-updated", onCartUpdate);
    return () => window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

  const increase = (id, size) => {
    const item = products.find(
      (product) => product.id === id && product.size === size
    );
    if (item) updateQuantity(id, size, item.quantity + 1);
  };

  const decrease = (id, size) => {
    const item = products.find(
      (product) => product.id === id && product.size === size
    );
    if (item) updateQuantity(id, size, item.quantity - 1);
  };

  const removeProduct = (id, size) => {
    removeFromCart(id, size);
  };

  const handleChange = (e) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  const subtotal = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingCost = subtotal > 0 ? 5 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shippingCost + tax;

  async function handlePlaceOrder() {
    if (products.length === 0) return;

    if (
      !shipping.firstName.trim() ||
      !shipping.lastName.trim() ||
      !shipping.address.trim() ||
      !shipping.city.trim() ||
      !shipping.phone.trim()
    ) {
      setOrderMessage("validation");
      return;
    }

    setPlacing(true);
    setOrderMessage(null);

    try {
      await createOrder({
        full_name: `${shipping.firstName} ${shipping.lastName}`.trim(),
        phone: shipping.phone,
        address: [
          shipping.address,
          shipping.city,
          shipping.region,
          shipping.zip,
        ]
          .filter(Boolean)
          .join(", "),
        note: payment === "cash" ? "Cash on Delivery" : "Card payment",
        items: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
        })),
      });
      clearCart();
      setOrderMessage("success");
    } catch {
      setOrderMessage("error");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="checkout-page">

      {/* HEADER */}
      <header className="checkout-header">
        <Link to="/" className="checkout-logo">
          <FaShoppingCart />
          <span>Premium Store</span>
        </Link>

        <div className="secure-checkout">
          <FaLock />
          <span>Secure Checkout</span>
        </div>
      </header>

      {/* PAGE TITLE */}
      <section className="checkout-title">
        <span>
          <Link to="/">Home</Link> / Cart
        </span>
        <h1>Checkout</h1>
        <p>Complete your order by providing your details below.</p>
      </section>

      <main className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">

          {/* ORDER ITEMS */}
          <section className="checkout-card order-card">

            <div className="card-title">
              <div>
                <FaShoppingCart />
                <h2>Order Items</h2>
              </div>

              <span>{products.length} Items</span>
            </div>

            {products.length === 0 ? (
              <div className="empty-cart">
                <FaBoxOpen />
                <h3>Your cart is empty</h3>
                <p>Add some products to continue.</p>
                <Link to="/shop" className="continue-shopping">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="products-list">

                {products.map((product) => (
                  <div className="product-item" key={`${product.id}-${product.size || "default"}`}>

                    <div className="product-image">
                      <img src={product.image} alt={product.title} />
                    </div>

                    <div className="product-info">
                      <h3>{product.title}</h3>

                      <p className="category">
                        {product.category}
                      </p>

                      <div className="product-meta">
                        <span>
                          Size: <b>{product.size || "-"}</b>
                        </span>
                      </div>

                      <div className="product-bottom">

                        <div className="quantity">
                          <button
                            onClick={() => decrease(product.id, product.size)}
                          >
                            <FaMinus />
                          </button>

                          <span>{product.quantity}</span>

                          <button
                            onClick={() => increase(product.id, product.size)}
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            removeProduct(product.id, product.size)
                          }
                        >
                          <FaTrash />
                          Remove
                        </button>

                      </div>
                    </div>

                    <div className="product-price">
                      <strong>
                        ${(product.price * product.quantity).toFixed(2)}
                      </strong>

                      <small>
                        ${product.price.toFixed(2)} each
                      </small>
                    </div>

                  </div>
                ))}

              </div>
            )}
          </section>

          {/* SHIPPING */}
          <section className="checkout-card">

            <div className="section-heading">
              <FaTruck />
              <div>
                <h2>Shipping Details</h2>
                <p>Enter your delivery information</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  required
                  value={shipping.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  required
                  value={shipping.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group full">
                <label>Address</label>

                <div className="input-icon">
                  <FaMapMarkerAlt />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street address"
                    required
                    value={shipping.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  value={shipping.city}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Region</label>
                <input
                  type="text"
                  name="region"
                  placeholder="Region"
                  value={shipping.region}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP code"
                  value={shipping.zip}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+998 90 000 00 00"
                  required
                  value={shipping.phone}
                  onChange={handleChange}
                />
              </div>

            </div>
          </section>

          {/* PAYMENT */}
          <section className="checkout-card payment-card">

            <div className="section-heading">
              <FaCreditCard />
              <div>
                <h2>Payment Method</h2>
                <p>Choose your preferred payment method</p>
              </div>
            </div>

            <label
              className={`payment-option ${
                payment === "card" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                checked={payment === "card"}
                onChange={() => setPayment("card")}
              />

              <div className="payment-icon">
                <FaCreditCard />
              </div>

              <div>
                <strong>Credit / Debit Card</strong>
                <small>Visa, Mastercard, Uzcard, Humo</small>
              </div>

              {payment === "card" && (
                <FaCheckCircle className="check-icon" />
              )}
            </label>

            {payment === "card" && (
              <div className="card-fields">

                <div className="input-group full">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>

                <div className="input-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                  />
                </div>

                <div className="input-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                  />
                </div>

              </div>
            )}

            <label
              className={`payment-option ${
                payment === "cash" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                checked={payment === "cash"}
                onChange={() => setPayment("cash")}
              />

              <div className="payment-icon">
                <FaTruck />
              </div>

              <div>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </div>

              {payment === "cash" && (
                <FaCheckCircle className="check-icon" />
              )}
            </label>

          </section>
        </div>

        {/* RIGHT */}
        <aside className="checkout-right">
              
          <div className="summary-card">

            <div className="summary-title">
              <h2>Order Summary</h2>
              <FaShoppingCart />
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong>${shippingCost.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Tax (5%)</span>
              <strong>${tax.toFixed(2)}</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <button
              className="place-order"
              onClick={handlePlaceOrder}
              disabled={placing || products.length === 0}
            >
              {placing ? "Placing..." : "Place Order"}
              <FaArrowRight />
            </button>

            {orderMessage === "success" && (
              <p className="order-message success">
                ✓ Buyurtma qabul qilindi! Rahmat.
              </p>
            )}

            {orderMessage === "error" && (
              <p className="order-message error">
                Xatolik yuz berdi. Qaytadan urinib ko'ring.
              </p>
            )}

            {orderMessage === "validation" && (
              <p className="order-message error">
                Iltimos, barcha majburiy maydonlarni to'ldiring.
              </p>
            )}

            <div className="secure-info">
              <FaLock />
              <span>
                Your payment information is encrypted
                and secure.
              </span>
            </div>

          </div>

          <div className="benefits">

            <div>
              <FaTruck />
              <span>
                <strong>Fast Delivery</strong>
                2–5 business days
              </span>
            </div>

            <div>
              <FaCheckCircle />
              <span>
                <strong>Quality Guarantee</strong>
                Premium quality products
              </span>
            </div>

          </div>

        </aside>

      </main>
    </div>
  );
}