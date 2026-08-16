import { useState } from "react";
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

const initialProducts = [
  {
    id: 1,
    title: "Premium Winter Jacket",
    category: "Boys Collection",
    size: "M",
    color: "Black",
    price: 25.5,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
  },
  {
    id: 2,
    title: "Kids Fashion Hoodie",
    category: "Winter Collection",
    size: "L",
    color: "Black",
    price: 18.0,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
  },
];

export default function SavatPage() {
  const [products, setProducts] = useState(initialProducts);

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

  const increase = (id) => {
    setProducts((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrease = (id) => {
    setProducts((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((items) => items.filter((item) => item.id !== id));
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

  return (
    <div className="checkout-page">

      {/* HEADER */}
      <header className="checkout-header">
        <div className="checkout-logo">
          <FaShoppingCart />
          <span>EBR GIMMING</span>
        </div>

        <div className="secure-checkout">
          <FaLock />
          <span>Secure Checkout</span>
        </div>
      </header>

      {/* PAGE TITLE */}
      <section className="checkout-title">
        <span>Home / Cart</span>
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
              </div>
            ) : (
              <div className="products-list">

                {products.map((product) => (
                  <div className="product-item" key={product.id}>

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
                          Size: <b>{product.size}</b>
                        </span>

                        <span>
                          Color: <b>{product.color}</b>
                        </span>
                      </div>

                      <div className="product-bottom">

                        <div className="quantity">
                          <button
                            onClick={() => decrease(product.id)}
                          >
                            <FaMinus />
                          </button>

                          <span>{product.quantity}</span>

                          <button
                            onClick={() => increase(product.id)}
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            removeProduct(product.id)
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

            <div className="discount-box">
              <input
                type="text"
                placeholder="Promo code"
              />

              <button>Apply</button>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <button className="place-order">
              Place Order
              <FaArrowRight />
            </button>

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