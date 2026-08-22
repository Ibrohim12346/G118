import { useEffect, useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaTruck, FaTags, FaStar, FaArrowRight, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart, FaUser, FaBars, FaMoon, FaSun, FaTimes, FaGlobe, FaShieldAlt, FaHeadset, FaCheck, FaTelegramPlane, FaYoutube } from "react-icons/fa";

import { getProducts, getCategories, subscribe } from "../api.js";
import { getCartCount } from "../cart.js";

/* =========================================================
   TRANSLATIONS
======================================================= */

const translations = {
  uz: {
    home: "Bosh sahifa",
    products: "Mahsulotlar",
    shop: "Do‘kon",
    cart: "Savat",

    heroTitle: "Discover Your Perfect Style",
    heroText: "Quality products, modern design and the best shopping experience.",
    shopNow: "Shop Now",
    exploreCollection: "Explore Collection",

    fastDelivery: "Fast Delivery",
    fastDeliveryText: "Fast and reliable delivery for wholesale orders.",

    premiumQuality: "Premium Quality",
    premiumQualityText: "High-quality products carefully selected for our customers.",

    securePayment: "Secure Payment",
    securePaymentText: "Safe and encrypted payment gateways for every order.",

    support_24_7: "24/7 Support",
    support_24_7Text: "Always here to help - friendly customer support around the clock.",

    shopByCategory: "SHOP BY CATEGORY",
    explore: "Explore",

    ourCollection: "OUR COLLECTION",
    topProducts: "Top Products",
    viewAll: "View All",

    whyChooseUs: "WHY CHOOSE US?",
    fastDeliveryTitle: "Fast Delivery",
    fastDeliveryDesc: "We provide fast and reliable delivery for wholesale orders.",
    premiumQualityTitle: "Premium Quality",
    premiumQualityDesc: "High-quality products carefully selected for our customers.",
    securePaymentTitle: "Secure Payment",
    securePaymentDesc: "Safe and encrypted payment gateways for every order.",
    support_24_7Title: "24/7 Support",
    support_24_7Desc: "Always here to help - friendly customer support around the clock.",

    specialOffer: "SPECIAL OFFER",
    discount: "Up to 50% OFF",
    countdown: "Countdown",
    ctaShop: "Shop Collection",

    testimonials: "CUSTOMER REVIEWS",
    customerReviews: "Customer Reviews",
    verifiedCustomer: "Verified Customer",

    newsletter: "STAY UPDATED",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    subscribeSuccess: "✓ You are subscribed! Thank you.",
    subscribeError: "Something went wrong. Please try again.",

    quickLinks: "Quick Links",
    company: "Company",
    aboutUs: "About Us",
    contact: "Contact",
    privacyPolicy: "Privacy Policy",
    terms: "Terms",

    contactTitle: "Contact",
    trustedPartner: "Your trusted wholesale clothing partner. Premium quality apparel delivered at scale.",

    allRights: "All Rights Reserved.",

    search: "Search",
    user: "Profile",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",

    loading: "Loading products...",
    backendError: "Could not connect to the backend. Please start the Django server.",
  },

  en: {
    home: "Home",
    products: "Products",
    shop: "Shop",
    cart: "Cart",

    heroTitle: "Discover Your Perfect Style",
    heroText: "Quality products, modern design and the best shopping experience.",
    shopNow: "Shop Now",
    exploreCollection: "Explore Collection",

    fastDelivery: "Fast Delivery",
    fastDeliveryText: "We provide fast and reliable delivery for wholesale orders.",

    premiumQuality: "Premium Quality",
    premiumQualityText: "High-quality products carefully selected for our customers.",

    securePayment: "Secure Payment",
    securePaymentText: "Safe and encrypted payment gateways for every order.",

    support_24_7: "24/7 Support",
    support_24_7Text: "Always here to help - friendly customer support around the clock.",

    shopByCategory: "SHOP BY CATEGORY",
    explore: "Explore",

    ourCollection: "OUR COLLECTION",
    topProducts: "Top Products",
    viewAll: "View All",

    whyChooseUs: "WHY CHOOSE US?",
    fastDeliveryTitle: "Fast Delivery",
    fastDeliveryDesc: "We provide fast and reliable delivery for wholesale orders.",
    premiumQualityTitle: "Premium Quality",
    premiumQualityDesc: "High-quality products carefully selected for our customers.",
    securePaymentTitle: "Secure Payment",
    securePaymentDesc: "Safe and encrypted payment gateways for every order.",
    support_24_7Title: "24/7 Support",
    support_24_7Desc: "Always here to help - friendly customer support around the clock.",

    specialOffer: "SPECIAL OFFER",
    discount: "Up to 50% OFF",
    countdown: "Countdown",
    ctaShop: "Shop Collection",

    testimonials: "CUSTOMER REVIEWS",
    customerReviews: "Customer Reviews",
    verifiedCustomer: "Verified Customer",

    newsletter: "STAY UPDATED",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    subscribeSuccess: "✓ You are subscribed! Thank you.",
    subscribeError: "Something went wrong. Please try again.",

    quickLinks: "Quick Links",
    company: "Company",
    aboutUs: "About Us",
    contact: "Contact",
    privacyPolicy: "Privacy Policy",
    terms: "Terms",

    contactTitle: "Contact",
    trustedPartner: "Your trusted wholesale clothing partner. Premium quality apparel delivered at scale.",

    allRights: "All Rights Reserved.",

    search: "Search",
    user: "Profile",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",

    loading: "Loading products...",
    backendError: "Could not connect to the backend. Please start the Django server.",
  },

  tr: {
    home: "Ana Sayfa",
    products: "Ürünler",
    shop: "Mağaza",
    cart: "Sepet",

    heroTitle: "Discover Your Perfect Style",
    heroText: "Quality products, modern design and the best shopping experience.",
    shopNow: "Shop Now",
    exploreCollection: "Explore Collection",

    fastDelivery: "Hızlı Teslimat",
    fastDeliveryText: "Toptan siparişler için hızlı ve güvenilir teslimat sağlıyoruz.",

    premiumQuality: "Premium Kalite",
    premiumQualityText: "Müşterilerimiz için özenle seçilmiş yüksek kaliteli ürünler.",

    securePayment: "Güvenli Ödeme",
    securePaymentText: "Her sipariş için güvenli şifreli ödeme gateway'leri.",

    support_24_7: "24/7 Destek",
    support_24_7Text: "Her zaman yardımcı oluyuz - her zaman dostça destek.",

    shopByCategory: "KATEGORİYE GÖRE",
    explore: "Keşfet",

    ourCollection: "KOLEKSİYONUMUZ",
    topProducts: "En İyi Ürünler",
    viewAll: "Tümünü Gör",

    whyChooseUs: "Nİ NESNE?",
    fastDeliveryTitle: "Hızlı Teslimat",
    fastDeliveryDesc: "Toptan siparişler için hızlı ve güvenilir teslimat sağlıyoruz.",
    premiumQualityTitle: "Premium Kalite",
    premiumQualityDesc: "Müşterilerimiz için özenle seçilmiş yüksek kaliteli ürünler.",
    securePaymentTitle: "Güvenli Ödeme",
    securePaymentDesc: "Her sipariş için güvenli şifreli ödeme gateway'leri.",
    support_24_7Title: "24/7 Destek",
    support_24_7Desc: "Her zaman yardımcı oluyuz - her zaman dostça destek.",

    specialOffer: "ÖZEL TEKLIF",
    discount: "Aday %50 İNDİR",
    countdown: "Sayaç",
    ctaShop: "Collection'ı Al",

    testimonials: "MÜŞTERİ YORUMLARI",
    customerReviews: "Müşteri Yorumları",
    verifiedCustomer: "Doğrulanmış Müşteri",

    newsletter: "AYRICA BİLGİLENDİR",
    enterEmail: "E-posta adresinizi girin",
    subscribe: "Abone Ol",
    subscribeSuccess: "✓ Abone oldunuz! Teşekkürler.",
    subscribeError: "Bir hata oluştu. Lütfen tekrar deneyin.",

    quickLinks: "Hızlı Bağlantılar",
    company: "Şirket",
    aboutUs: "Hakkımızda",
    contact: "İletişim",
    privacyPolicy: "Gizlilik Politikası",
    terms: "Şartlar",

    contactTitle: "İletişim",
    trustedPartner: "Güvenilir toptan giyim ortağınız. Premium kaliteli giyim ürünleri büyük ölçekte teslim edilir.",

    allRights: "Tüm Hakları Saklıdır.",

    search: "Ara",
    user: "Profil",
    language: "Dil",
    darkMode: "Karanlık Mod",
    lightMode: "Aydınlık Mod",

    loading: "Ürünler yükleniyor...",
    backendError: "Backend sunucusuna bağlanılamadı. Django sunucusunu başlatın.",
  },
};

/* =========================================================
   PRICE FORMATTER
======================================================= */

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

/* =========================================================
   HOME PAGE COMPONENT
======================================================= */

function HomePage() {
  /* =========================
     STATES
  ========================= */

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customerReviews, setCustomerReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState(null);

  const [cartCount, setCartCount] = useState(getCartCount());

  const [menuOpen, setMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "uz"
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* =========================
     TRANSLATION
  ========================= */

  const t = translations[language];

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    async function loadData() {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts({ featured: "true" }),
          getCategories(),
        ]);

        setProducts(productData.data?.items ?? productData.data ?? []);
        setCategories(categoryData.data?.items ?? categoryData.data ?? []);
        setCustomerReviews([]);
      } catch {
        setError(t.backendError);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* =========================
     CART UPDATE
  ========================= */

  useEffect(() => {
    const onCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("cart-updated", onCartUpdate);

    return () => {
      window.removeEventListener(
        "cart-updated",
        onCartUpdate
      );
    };
  }, []);

  /* =========================
     DARK MODE SAVE
  ========================= */

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  /* =========================
     LANGUAGE SAVE
  ========================= */

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  /* =========================
     SUBSCRIBE
  ========================= */

  async function handleSubscribe(event) {
    event.preventDefault();

    setSubStatus(null);

    try {
      await subscribe(email);

      setSubStatus("success");
      setEmail("");
    } catch {
      setSubStatus("error");
    }
  }

  /* =========================
     DARK MODE
  ========================= */

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  /* =========================
     LANGUAGE
  ========================= */

  function changeLanguage(event) {
    setLanguage(event.target.value);
  }

  /* =========================
     SEARCH
  ========================= */

  function toggleSearch() {
    setSearchOpen((prev) => !prev);
    setSearchText("");
  }

  const filteredProducts = products.filter((product) =>
    product.title
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  /* =========================
     PRODUCTS ARRAY (for Featured Products)
  ========================= */

  const featuredProducts = products.slice(0, 8);

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div
      className={`home-page ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {/* =====================================================
         HEADER
      ===================================================== */}

      <header className="header">

        {/* LOGO */}

        <Link to="/" className="logo">
          <span>Premium</span> Store
        </Link>

        {/* NAVIGATION */}

        <nav>
          <Link to="/" className="active">
            {t.home}
          </Link>

          <Link to="/mahsulodlari">
            {t.products}
          </Link>

          <Link to="/shop">
            {t.shop}
          </Link>

          <Link to="/savat">
            {t.cart}
          </Link>
        </nav>

        {/* HEADER TOOLS */}

        <div className="header-tools">

          {/* LANGUAGE */}

          <div
            className="language-box"
            title={t.language}
          >
            <FaGlobe />

            <select
              value={language}
              onChange={changeLanguage}
              aria-label={t.language}
            >
              <option value="uz">
                UZ
              </option>

              <option value="ru">
                RU
              </option>

              <option value="en">
                EN
              </option>

              <option value="tr">
                TR
              </option>
            </select>
          </div>

          {/* DARK MODE */}

          <button
            className="theme-btn"
            onClick={toggleDarkMode}
            aria-label={
              darkMode
                ? t.lightMode
                : t.darkMode
            }
            title={
              darkMode
                ? t.lightMode
                : t.darkMode
            }
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>

        </div>

        {/* HEADER ICONS */}

        <div className="header-icons">

          {/* SEARCH */}

          <button
            className="icon-btn"
            onClick={toggleSearch}
            title={t.search}
          >
            {searchOpen ? (
              <FaTimes />
            ) : (
              <FaSearch />
            )}
          </button>

          {/* USER */}

          <Link
            to="/dashboard"
            className="icon-btn"
            title={t.user}
          >
            <FaUser />
          </Link>

          {/* CART */}

          <Link
            to="/savat"
            className="icon-btn cart-btn"
            title={t.cart}
          >
            <FaShoppingCart />

            <span className="cart-count">
              {cartCount}
            </span>
          </Link>

        </div>

        {/* MOBILE BUTTON */}

        <button
          className="menu-toggle"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Menu"
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

      </header>

      {/* =====================================================
         SEARCH PANEL
      ===================================================== */}

      <div
        className={`search-panel ${
          searchOpen ? "open" : ""
        }`}
      >
        <div className="search-inner">

          <FaSearch />

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder={t.search}
            autoFocus={searchOpen}
          />

          {searchText && (
            <button
              onClick={() =>
                setSearchText("")
              }
            >
              <FaTimes />
            </button>
          )}

        </div>

        {searchText && (
          <div className="search-results">

            {filteredProducts.length > 0 ? (
              filteredProducts
                .slice(0, 5)
                .map((product) => (
                  <Link
                    key={product.id}
                    to={`/mahsulodlari/${product.id}`}
                    onClick={() =>
                      setSearchOpen(false)
                    }
                  >
                    <span>
                      {product.title}
                    </span>

                    <strong>
                      {formatPrice(
                        product.wholesale_price ??
                          product.price
                      )}
                    </strong>
                  </Link>
                ))
            ) : (
              <p>
                {t.products}: 0
              </p>
            )}

          </div>
        )}

      </div>

      {/* =====================================================
         MOBILE MENU
      ===================================================== */}

      <div
        className={`mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >

        <Link
          to="/"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t.home}
        </Link>

        <Link
          to="/mahsulodlari"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t.products}
        </Link>

        <Link
          to="/shop"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t.shop}
        </Link>

        <Link
          to="/savat"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t.cart}
        </Link>

        {/* MOBILE LANGUAGE */}

        <div className="mobile-language">

          <FaGlobe />

          <select
            value={language}
            onChange={changeLanguage}
          >
            <option value="uz">
              🇺🇿 O‘zbek
            </option>

            <option value="ru">
              🇷🇺 Русский
            </option>

            <option value="en">
              🇬🇧 English
            </option>

            <option value="tr">
              🇹🇷 Türkçe
            </option>
          </select>

        </div>

        {/* MOBILE THEME */}

        <button
          className="mobile-theme"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <>
              <FaSun />
              {t.lightMode}
            </>
          ) : (
            <>
              <FaMoon />
              {t.darkMode}
            </>
          )}
        </button>

      </div>

      {/* =====================================================
         HERO SECTION
      ===================================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="small-title">
            {t.wholesaleFashion}
          </span>

          <h1>
            {t.heroTitle}
            <br />
            {t.heroTitle2}
          </h1>

          <p>
            {t.heroText}
          </p>

          <div className="hero-buttons">

            <Link
              to="/mahsulodlari"
              className="primary-btn"
            >
              {t.shopNow}

              <FaArrowRight />
            </Link>

            <a
              href="#contact"
              className="secondary-btn"
            >
              {t.exploreCollection}

              <FaArrowRight />
            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
         FEATURES SECTION
      ===================================================== */}

      <section className="features">

        <div className="section-title">

          <span>
            {t.whyChooseUs}
          </span>

          <h2>
            {t.shopByCategory}
          </h2>

        </div>

        <div className="feature-grid">

          {/* Fast Delivery */}

          <div
            className="feature-card"
            style={{
              transition: "transform 0.4s ease, box-shadow 0.4s ease"
            }}
          >

            <div className="feature-icon">
              <FaTruck />
            </div>

            <h3>
              {t.fastDeliveryTitle}
            </h3>

            <p>
              {t.fastDeliveryDesc}
            </p>

          </div>

          {/* Premium Quality */}

          <div
            className="feature-card"
            style={{
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              animationDelay: "0.1s"
            }}
          >

            <div className="feature-icon">
              <FaStar />
            </div>

            <h3>
              {t.premiumQualityTitle}
            </h3>

            <p>
              {t.premiumQualityDesc}
            </p>

          </div>

          {/* Secure Payment */}

          <div
            className="feature-card"
            style={{
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              animationDelay: "0.2s"
            }}
          >

            <div className="feature-icon">
              <FaShieldAlt />
            </div>

            <h3>
              {t.securePaymentTitle}
            </h3>

            <p>
              {t.securePaymentDesc}
            </p>

          </div>

          {/* 24/7 Support */}

          <div
            className="feature-card"
            style={{
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              animationDelay: "0.3s"
            }}
          >

            <div className="feature-icon">
              <FaHeadset />
            </div>

            <h3>
              {t.support_24_7Title}
            </h3>

            <p>
              {t.support_24_7Desc}
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
         CATEGORIES SECTION
      ===================================================== */}

      <section
        className="categories"
        id="categories"
      >

        <div className="section-title">

          <span>
            {t.shopByCategory}
          </span>

          <h2>
            {t.wholesaleCategories}
          </h2>

        </div>

        <div className="category-grid">

          {categories.map(
            (category, index) => {

              return (

                <div
                  className={`category-card category-${
                    index + 1
                  }`}
                  key={
                    category.id ??
                    index
                  }
                >

                  <div className="category-overlay"></div>

                  <div className="category-content">

                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <h3>
                      {category.name}
                    </h3>

                    <Link to="/shop">

                      {t.explore}

                      <FaArrowRight />

                    </Link>

                  </div>

                </div>

              )

            }
          )}

        </div>

      </section>

      {/* =====================================================
         FEATURED PRODUCTS SECTION
      ===================================================== */}

      <section
        className="products"
        id="products"
      >

        <div className="section-heading">

          <div>

            <span>
              {t.ourCollection}
            </span>

            <h2>
              {t.topProducts}
            </h2>

          </div>

          <Link
            to="/shop"
            className="view-all"
          >
            {t.viewAll}

            <FaArrowRight />

          </Link>

        </div>

        {/* ERROR */}

        {error && (
          <p className="api-error">
            {error}
          </p>
        )}

        {/* LOADING */}

        {loading && (
          <p className="loading-text">
            {t.loading}
          </p>
        )}

        {/* PRODUCT GRID */}

        <div className="product-grid">

          {featuredProducts.map(
            (product, index) => {

              return (

                <Link
                  to={`/mahsulodlari/${product.id}`}
                  className="product-card"
                  key={
                    product.id ??
                    index
                  }
                >

                  {/* IMAGE */}

                  <div className="product-image">

                    <img
                      src={
                        product.image_url ||
                        product.image
                      }
                      alt={
                        product.title
                      }
                      onError={(
                        event
                      ) => {
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e";
                      }}
                    />

                    <span className="badge">
                      {t.wholesale}
                    </span>

                    <button
                      className="product-heart"
                      onClick={(event) => {
                        event.preventDefault();
                      }}
                      aria-label="Favorite"
                    >
                      <FaHeart />
                    </button>

                  </div>

                  {/* PRODUCT INFO */}

                  <div className="product-info">

                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>
                      {product.title}
                    </h3>

                    {/* RATING */}

                    <div className="product-rating">

                      {Array.from({
                        length: 5,
                      }).map(
                        (
                          _,
                          starIndex
                        ) => (

                          <FaStar
                            key={
                              starIndex
                            }
                            className={
                              starIndex <
                              Math.round(
                                product.rating ??
                                  5
                              )
                                ? "star active"
                                : "star"
                            }
                          />

                        )
                      )}

                      <span>
                        {(
                          product.rating ??
                          5
                        ).toFixed(1)}
                      </span>

                    </div>

                    {/* PRICE */}

                    <div className="product-bottom">

                      <strong>
                        {formatPrice(
                          product.wholesale_price ??
                            product.price
                        )}
                      </strong>

                      {product.discount > 0 && (
                        <span className="discount-badge">
                          -{product.discount}%
                        </span>
                      )}

                      <span className="view-btn">

                        {t.viewProducts}

                        <FaArrowRight />

                      </span>

                    </div>

                  </div>

                </Link>

              )

            }
          )}

        </div>

      </section>

      {/* =====================================================
         PROMO BANNER SECTION
      ===================================================== */}

      <section
        className="promo-banner"
      >

        <div className="banner-content">

          <span>
            {t.summerCollection}
          </span>

          {/* <h2>
            {t.upTo50%OFF}
          </h2> */}

          <a
            href="#products"
            className="banner-btn"
          >
            {t.shopCollection}

            <FaArrowRight />
          </a>

        </div>

      </section>

      {/* =====================================================
         SPECIAL OFFER SECTION
      ===================================================== */}

      <section
        className="special-offer"
      >

        <div className="offer-countdown">

          <span>
            {t.discount}
          </span>

          <div className="countdown-timer" id="countdownTimer">

            <div className="countdown-item">

              <span className="countdown-value" data-days>
                00
              </span>

              <span className="countdown-label">
                {t.days}
              </span>

            </div>

            <div className="countdown-item">

              <span className="countdown-value" data-hours>
                00
              </span>

              <span className="countdown-label">
                {t.hours}
              </span>

            </div>

            <div className="countdown-item">

              <span className="countdown-value" data-minutes>
                00
              </span>

              <span className="countdown-label">
                {t.minutes}
              </span>

            </div>

            <div className="countdown-item">

              <span className="countdown-value" data-seconds>
                00
              </span>

              <span className="countdown-label">
                {t.seconds}
              </span>

            </div>

          </div>

        </div>

        <div className="offer-cta">

          <a
            href="#products"
            className="cta-button"
          >
            {t.ctaShop}

            <FaArrowRight />
          </a>

        </div>

      </section>

      {/* =====================================================
         TESTIMONIALS SECTION
      ===================================================== */}
      <section className="reviews" id="reviews">
        <div className="section-title">
          <span>{t.testimonials}</span>
          <h2>{t.customerReviews}</h2>
        </div>

        <div className="review-carousel">
          {customerReviews.map((review, index) => (
            <div className="review-card" key={review.id ?? index}>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    className={
                      starIndex < Math.round(review.rating ?? 5)
                        ? "active"
                        : ""
                    }
                  />
                ))}
              </div>

              <p>"{review.text}"</p>

              <div className="review-user">
                <div className="avatar">
                  {review.name?.charAt(0)}
                </div>
                <div>
                  <strong>{review.name}</strong>
                  <span>
                    <FaCheck />
                    {t.verifiedCustomer}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
         NEWSLETTER SECTION
      ===================================================== */}
      <section className="newsletter">
        <div className="newsletter-content">
          <span>{t.stayUpdated}</span>
          <h2>{t.subscribeTitle}</h2>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="email-input">
              <FaEnvelope />
              <input
                type="email"
                required
                placeholder={t.enterEmail}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                pattern=".+@.+\\..+"
                title="Please enter a valid email address"
              />
            </div>

            <button type="submit">
              {t.subscribe}
              <FaArrowRight />
            </button>
          </form>

          {subStatus === "success" && (
            <p className="sub-message success">{t.subscribeSuccess}</p>
          )}

          {subStatus === "error" && (
            <p className="sub-message error">{t.subscribeError}</p>
          )}
        </div>
      </section>

      {/* =====================================================
         FOOTER
      ===================================================== */}

      <footer
        className="footer"
        id="contact"
      >

        <div className="footer-main">

          {/* ABOUT */}

          <div className="footer-about">

            <div className="footer-logo">

              <span>
                Premium
              </span>{" "}
              Store
            </div>

            <p>
              {t.trustedPartner}
            </p>

            {/* SOCIALS */}

            <div className="socials">

              <a
                href="#"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="Telegram"
              >
                <FaTelegramPlane />
              </a>

              <a
                href="#"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>

            </div>

          </div>

          {/* QUICK LINKS */}

          <div className="footer-column">

            <h3>
              {t.quickLinks}
            </h3>

            <a href="#home">
              {t.home}
            </a>

            <a href="#products">
              {t.products}
            </a>

            <a href="#categories">
              {t.wholesaleCategories}
            </a>

            <a href="#reviews">
              {t.customerReviews}
            </a>

          </div>

          {/* CUSTOMER SERVICE */}

          <div className="footer-column">

            <h3>
              {t.customerService}
            </h3>

            <a href="#contact">
              {t.contact}
            </a>

            <a href="#privacyPolicy">
              {t.privacyPolicy}
            </a>

            <a href="#terms">
              {t.terms}
            </a>

          </div>

          {/* CONTACT */}

          <div className="footer-column">

            <h3>
              {t.contactTitle}
            </h3>

            <a href="tel:+998990924985">

              <FaPhoneAlt />

              +998 99 092 49 85

            </a>

            <a href="mailto:info@example.com">

              <FaEnvelope />

              info@example.com

            </a>

            <span>

              <FaMapMarkerAlt />

              Tashkent, Uzbekistan

            </span>

          </div>

        </div>

        {/* COPYRIGHT */}

        <div className="copyright">

          © 2026 Premium Store Apparel.
          {" "}
          {t.allRights}

        </div>

      </footer>

    </div>
  );
}

export default HomePage;