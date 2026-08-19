import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

import "./AboutPage.css";

import { getCartCount } from "../cart.js";

export default function AboutPage() {
  const [cartCount, setCartCount] = useState(getCartCount());
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const onCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", onCartUpdate);
    return () => window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

  function toggleDarkMode() {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", String(next));
      return next;
    });
  }

  return (
    <div className={`about-page ${darkMode ? "dark-mode" : ""}`}>
      <header className="about-header">
        <Link to="/" className="about-logo">
          <span>Premium</span> Store
        </Link>

        <nav className="about-nav">
          <Link to="/">Bosh sahifa</Link>
          <Link to="/mahsulodlari">Mahsulotlar</Link>
          <Link to="/shop">Do'kon</Link>
          <Link to="/savat">Savat</Link>
        </nav>

        <div className="about-actions">
          <button
            className="dark-toggle"
            onClick={toggleDarkMode}
            aria-label="Tungi rejim"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <Link to="/savat" className="about-cart">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="about-cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </header>

      <section className="about-hero">
        <p className="about-eyebrow">BIZ HAQIMIZDA</p>
        <h1>Premium Store — ulgurji kiyim savdosida ishonchli hamkor</h1>
        <p className="about-lead">
          Biz chakana va ulgurji mijozlarga yuqori sifatli kiyim-kechaklarni
          raqobatbardosh narxlarda yetkazib beramiz. 2026-yildan beri
          mijozlarimizga sodiq xizmat ko'rsatmoqdamiz.
        </p>
      </section>

      <section className="about-mission">
        <div className="mission-card">
          <h2>Missiyamiz</h2>
          <p>
            Har bir mijozga arzon narxlarda premium sifatli mahsulotlarni
            taqdim etish va biznesingizni rivojlantirishga yordam berish.
          </p>
        </div>
        <div className="mission-card">
          <h2>Qadriyatlarimiz</h2>
          <p>
            Halollik, sifat va ishonch. Biz har bir buyurtmani diqqat bilan
            qadoqlaymiz va o'z vaqtida yetkazib beramiz.
          </p>
        </div>
      </section>

      <section className="about-stats">
        <div className="stat-box">
          <strong>50+</strong>
          <span>Mahsulot turlari</span>
        </div>
        <div className="stat-box">
          <strong>500+</strong>
          <span>Mamnun mijozlar</span>
        </div>
        <div className="stat-box">
          <strong>100%</strong>
          <span>Sifat kafolati</span>
        </div>
      </section>

      <section className="about-features">
        <div className="feature-item">
          <FaTruck />
          <div>
            <strong>Tezkor yetkazib berish</strong>
            <p>Buyurtmalar 2–5 ish kuni ichida yetkaziladi.</p>
          </div>
        </div>
        <div className="feature-item">
          <FaShieldAlt />
          <div>
            <strong>Xavfsiz to'lov</strong>
            <p>Barcha to'lovlar himoyalangan va shifrlangan.</p>
          </div>
        </div>
        <div className="feature-item">
          <FaCheckCircle />
          <div>
            <strong>Kafolatlangan sifat</strong>
            <p>Har bir mahsulot sifat nazoratidan o'tkaziladi.</p>
          </div>
        </div>
      </section>

      <section className="about-reviews">
        <div className="about-reviews-head">
          <FaStar />
          <h2>Mijozlarimiz biz haqimizda</h2>
        </div>
        <div className="about-reviews-grid">
          <div className="about-review">
            <p>
              "Premium Store'dan bir necha marta buyurtma qildim. Sifat va
              narx nisbati ajoyib."
            </p>
            <strong>Fashion Store</strong>
          </div>
          <div className="about-review">
            <p>
              "Tezkor yetkazib berish va ajoyib xizmat. Hamma do'stimga tavsiya
              qilaman."
            </p>
            <strong>Kids Shop</strong>
          </div>
          <div className="about-review">
            <p>
              "Ulgurji narxlar eng yaxshisi. Biznesimiz uchun ideal hamkor."
            </p>
            <strong>Ali Market</strong>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Biz bilan hamkorlik qilishga tayyormisiz?</h2>
        <p>Bugun do'konimizga tashrif buyuring va eng yaxshi narxlarni toping.</p>
        <Link to="/shop" className="about-cta-btn">
          Do'konga o'tish
        </Link>
      </section>

      <footer className="about-footer">
        <p>© 2026 Premium Store Apparel. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}