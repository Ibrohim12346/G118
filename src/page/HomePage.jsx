import { useEffect, useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

import {
  FaSearch,
  FaShoppingCart,
  FaTruck,
  FaTags,
  FaStar,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
  FaUser,
  FaCheck,
  FaBars,
  FaMoon,
  FaSun,
  FaGlobe,
  FaTimes,
} from "react-icons/fa";

import {
  getProducts,
  getCategories,
  getReviews,
  subscribe,
} from "../api.js";

import { getCartCount } from "../cart.js";

/* =========================================================
   FEATURES
========================================================= */

const features = [
  {
    icon: <FaTruck />,
    key: "fastDelivery",
  },
  {
    icon: <FaTags />,
    key: "bestPrice",
  },
  {
    icon: <FaStar />,
    key: "premiumQuality",
  },
];

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  uz: {
    home: "Bosh sahifa",
    products: "Mahsulotlar",
    shop: "Do‘kon",
    cart: "Savat",

    wholesaleFashion: "OPTOM SAVDO",
    heroTitle: "Premium do‘kon kiyimlari.",
    heroTitle2: "Keng ko‘lamda yetkazib beriladi.",
    heroText:
      "Sifatli kiyimlar — ulgurji narxlarda. Do‘konlar, chakana savdo va bizneslar uchun.",
    viewProducts: "Mahsulotlarni ko‘rish",
    contactUs: "Bog‘lanish",

    fastDelivery: "Tezkor yetkazib berish",
    fastDeliveryText:
      "Ulgurji buyurtmalar uchun tezkor va ishonchli yetkazib berish xizmatini taqdim etamiz.",

    bestPrice: "Eng yaxshi ulgurji narx",
    bestPriceText:
      "Biznes va katta hajmdagi xaridorlar uchun qulay va maqbul narxlar.",

    premiumQuality: "Yuqori sifat",
    premiumQualityText:
      "Mijozlarimiz uchun sinchkovlik bilan tanlangan yuqori sifatli mahsulotlar.",

    shopByCategory: "KATEGORIYA BO‘YICHA",
    wholesaleCategories: "Ulgurji toifalar",
    explore: "Ko‘rish",

    ourCollection: "BIZNING TO‘PLAM",
    topWholesaleProducts: "Eng yaxshi ulgurji mahsulotlar",
    viewAll: "Barchasini ko‘rish",
    wholesale: "OPTOM",

    whatCustomersSay: "MIJOZLARIMIZ FIKRI",
    customerReviews: "Mijozlar sharhlari",
    verifiedCustomer: "Tasdiqlangan mijoz",

    premiumWholesale: "PREMIUM ULgurji",
    readyToGrow: "Biznesingizni rivojlantirishga tayyormisiz?",
    growText:
      "Raqobatbardosh ulgurji narxlarda sifatli kiyimlarni oling va biznesingizni biz bilan rivojlantiring.",
    enterEmail: "Email manzilingizni kiriting",
    getStarted: "Boshlash",
    subscribeSuccess: "✓ Obuna bo‘ldingiz! Rahmat.",
    subscribeError: "Xatolik yuz berdi. Qaytadan urinib ko‘ring.",

    quickLinks: "Tezkor havolalar",
    company: "Kompaniya",
    aboutUs: "Biz haqimizda",
    contact: "Aloqa",
    privacyPolicy: "Maxfiylik siyosati",
    terms: "Shartlar",

    contactTitle: "Aloqa",
    trustedPartner:
      "Sizning ishonchli ulgurji kiyim hamkoringiz. Yuqori sifatli kiyimlar katta hajmda yetkazib beriladi.",

    allRights: "Barcha huquqlar himoyalangan.",

    search: "Qidirish",
    user: "Profil",
    language: "Til",
    darkMode: "Tungi rejim",
    lightMode: "Kunduzgi rejim",

    loading: "Mahsulotlar yuklanmoqda...",
    backendError:
      "Backend bilan bog‘lanib bo‘lmadi. Django serverini ishga tushiring.",
  },

  ru: {
    home: "Главная",
    products: "Товары",
    shop: "Магазин",
    cart: "Корзина",

    wholesaleFashion: "ОПТОВАЯ ПРОДАЖА",
    heroTitle: "Одежда Premium магазина.",
    heroTitle2: "Доставка в больших объёмах.",
    heroText:
      "Качественная одежда по оптовым ценам. Для магазинов, розничной торговли и бизнеса.",
    viewProducts: "Посмотреть товары",
    contactUs: "Связаться",

    fastDelivery: "Быстрая доставка",
    fastDeliveryText:
      "Мы предлагаем быструю и надёжную доставку оптовых заказов.",

    bestPrice: "Лучшая оптовая цена",
    bestPriceText:
      "Выгодные цены для бизнеса и покупателей, приобретающих товары оптом.",

    premiumQuality: "Премиальное качество",
    premiumQualityText:
      "Высококачественные товары, тщательно отобранные для наших клиентов.",

    shopByCategory: "ПО КАТЕГОРИЯМ",
    wholesaleCategories: "Оптовые категории",
    explore: "Смотреть",

    ourCollection: "НАША КОЛЛЕКЦИЯ",
    topWholesaleProducts: "Лучшие оптовые товары",
    viewAll: "Смотреть все",
    wholesale: "ОПТ",

    whatCustomersSay: "ОТЗЫВЫ КЛИЕНТОВ",
    customerReviews: "Отзывы клиентов",
    verifiedCustomer: "Проверенный клиент",

    premiumWholesale: "ПРЕМИАЛЬНЫЙ ОПТ",
    readyToGrow: "Готовы развивать свой бизнес?",
    growText:
      "Получайте качественную одежду по выгодным оптовым ценам и развивайте свой бизнес вместе с нами.",
    enterEmail: "Введите ваш email",
    getStarted: "Начать",
    subscribeSuccess: "✓ Вы подписались! Спасибо.",
    subscribeError: "Произошла ошибка. Попробуйте ещё раз.",

    quickLinks: "Быстрые ссылки",
    company: "Компания",
    aboutUs: "О нас",
    contact: "Контакты",
    privacyPolicy: "Политика конфиденциальности",
    terms: "Условия",

    contactTitle: "Контакты",
    trustedPartner:
      "Ваш надёжный партнёр по оптовой продаже одежды. Качественная одежда с доставкой в больших объёмах.",

    allRights: "Все права защищены.",

    search: "Поиск",
    user: "Профиль",
    language: "Язык",
    darkMode: "Тёмная тема",
    lightMode: "Светлая тема",

    loading: "Загрузка товаров...",
    backendError:
      "Не удалось подключиться к серверу. Запустите Django сервер.",
  },

  en: {
    home: "Home",
    products: "Products",
    shop: "Shop",
    cart: "Cart",

    wholesaleFashion: "WHOLESALE FASHION",
    heroTitle: "Premium Store Apparel.",
    heroTitle2: "Delivered at Scale.",
    heroText:
      "Quality clothing at wholesale prices. Built for retailers, stores and businesses.",
    viewProducts: "View Products",
    contactUs: "Contact Us",

    fastDelivery: "Fast Delivery",
    fastDeliveryText:
      "We provide fast and reliable delivery for wholesale orders.",

    bestPrice: "Best Wholesale Price",
    bestPriceText:
      "Affordable prices for businesses and bulk buyers.",

    premiumQuality: "Premium Quality",
    premiumQualityText:
      "High-quality products carefully selected for our customers.",

    shopByCategory: "SHOP BY CATEGORY",
    wholesaleCategories: "Wholesale Categories",
    explore: "Explore",

    ourCollection: "OUR COLLECTION",
    topWholesaleProducts: "Top Wholesale Products",
    viewAll: "View All",
    wholesale: "WHOLESALE",

    whatCustomersSay: "WHAT OUR CUSTOMERS SAY",
    customerReviews: "Customer Reviews",
    verifiedCustomer: "Verified Customer",

    premiumWholesale: "PREMIUM WHOLESALE",
    readyToGrow: "Ready to Grow Your Business?",
    growText:
      "Get premium apparel at competitive wholesale prices and grow your business with us.",
    enterEmail: "Enter your email",
    getStarted: "Get Started",
    subscribeSuccess: "✓ You are subscribed! Thank you.",
    subscribeError: "Something went wrong. Please try again.",

    quickLinks: "Quick Links",
    company: "Company",
    aboutUs: "About Us",
    contact: "Contact",
    privacyPolicy: "Privacy Policy",
    terms: "Terms",

    contactTitle: "Contact",
    trustedPartner:
      "Your trusted wholesale clothing partner. Premium quality apparel delivered at scale.",

    allRights: "All Rights Reserved.",

    search: "Search",
    user: "Profile",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",

    loading: "Loading products...",
    backendError:
      "Could not connect to the backend. Please start the Django server.",
  },

  tr: {
    home: "Ana Sayfa",
    products: "Ürünler",
    shop: "Mağaza",
    cart: "Sepet",

    wholesaleFashion: "TOPTAN SATIŞ",
    heroTitle: "Premium Mağaza Giyim.",
    heroTitle2: "Büyük Ölçekte Teslimat.",
    heroText:
      "Toptan fiyatlarla kaliteli giyim. Mağazalar, perakendeciler ve işletmeler için.",
    viewProducts: "Ürünleri Gör",
    contactUs: "İletişim",

    fastDelivery: "Hızlı Teslimat",
    fastDeliveryText:
      "Toptan siparişler için hızlı ve güvenilir teslimat sağlıyoruz.",

    bestPrice: "En İyi Toptan Fiyat",
    bestPriceText:
      "İşletmeler ve toplu alıcılar için uygun fiyatlar.",

    premiumQuality: "Premium Kalite",
    premiumQualityText:
      "Müşterilerimiz için özenle seçilmiş yüksek kaliteli ürünler.",

    shopByCategory: "KATEGORİYE GÖRE",
    wholesaleCategories: "Toptan Kategoriler",
    explore: "Keşfet",

    ourCollection: "KOLEKSİYONUMUZ",
    topWholesaleProducts: "En İyi Toptan Ürünler",
    viewAll: "Tümünü Gör",
    wholesale: "TOPTAN",

    whatCustomersSay: "MÜŞTERİLERİMİZ NE DİYOR",
    customerReviews: "Müşteri Yorumları",
    verifiedCustomer: "Doğrulanmış Müşteri",

    premiumWholesale: "PREMİUM TOPTAN",
    readyToGrow: "İşletmenizi büyütmeye hazır mısınız?",
    growText:
      "Rekabetçi toptan fiyatlarla kaliteli giyim alın ve işletmenizi bizimle büyütün.",
    enterEmail: "E-posta adresinizi girin",
    getStarted: "Başla",
    subscribeSuccess: "✓ Abone oldunuz! Teşekkürler.",
    subscribeError: "Bir hata oluştu. Lütfen tekrar deneyin.",

    quickLinks: "Hızlı Bağlantılar",
    company: "Şirket",
    aboutUs: "Hakkımızda",
    contact: "İletişim",
    privacyPolicy: "Gizlilik Politikası",
    terms: "Şartlar",

    contactTitle: "İletişim",
    trustedPartner:
      "Güvenilir toptan giyim ortağınız. Premium kaliteli giyim ürünleri büyük ölçekte teslim edilir.",

    allRights: "Tüm Hakları Saklıdır.",

    search: "Ara",
    user: "Profil",
    language: "Dil",
    darkMode: "Karanlık Mod",
    lightMode: "Aydınlık Mod",

    loading: "Ürünler yükleniyor...",
    backendError:
      "Backend sunucusuna bağlanılamadı. Django sunucusunu başlatın.",
  },
};

/* =========================================================
   PRICE
========================================================= */

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

/* =========================================================
   HOME PAGE
========================================================= */

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
        const [
          productData,
          categoryData,
          reviewData,
        ] = await Promise.all([
          getProducts({ featured: "true" }),
          getCategories(),
          getReviews(),
        ]);

        setProducts(productData.results ?? productData);
        setCategories(categoryData.results ?? categoryData);
        setCustomerReviews(reviewData.results ?? reviewData);
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
          <Link to="/">
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

          <button
            className="icon-btn"
            title={t.user}
          >
            <FaUser />
          </button>

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
          HERO
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
              {t.viewProducts}

              <FaArrowRight />
            </Link>

            <a
              href="#contact"
              className="secondary-btn"
            >
              {t.contactUs}

              <FaPhoneAlt />
            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="features">

        {features.map(
          (item, index) => {

            const title =
              t[item.key];

            const text =
              t[
                `${item.key}Text`
              ];

            return (
              <div
                className="feature-card"
                key={index}
              >

                <div className="feature-icon">
                  {item.icon}
                </div>

                <h3>
                  {title}
                </h3>

                <p>
                  {text}
                </p>

              </div>
            );
          }
        )}

      </section>

      {/* =====================================================
          CATEGORIES
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
            (category, index) => (

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
          )}

        </div>

      </section>

      {/* =====================================================
          PRODUCTS
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
              {t.topWholesaleProducts}
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

          {filteredProducts.map(
            (product, index) => (

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

                    <span className="view-btn">

                      {t.viewProducts}

                      <FaArrowRight />

                    </span>

                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      </section>

      {/* =====================================================
          REVIEWS
      ===================================================== */}

      <section
        className="reviews"
        id="reviews"
      >

        <div className="section-title">

          <span>
            {t.whatCustomersSay}
          </span>

          <h2>
            {t.customerReviews}
          </h2>

        </div>

        <div className="review-grid">

          {customerReviews.map(
            (
              review,
              index
            ) => (

              <div
                className="review-card"
                key={
                  review.id ??
                  index
                }
              >

                {/* STARS */}

                <div className="stars">

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
                            review.rating ??
                              5
                          )
                            ? "active"
                            : ""
                        }
                      />

                    )
                  )}

                </div>

                {/* TEXT */}

                <p>
                  "{review.text}"
                </p>

                {/* USER */}

                <div className="review-user">

                  <div className="avatar">
                    {review.name?.charAt(
                      0
                    )}
                  </div>

                  <div>

                    <strong>
                      {review.name}
                    </strong>

                    <span>

                      <FaCheck />

                      {t.verifiedCustomer}

                    </span>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <form
        className="cta"
        onSubmit={
          handleSubscribe
        }
      >

        <div className="cta-content">

          <span>
            {t.premiumWholesale}
          </span>

          <h2>
            {t.readyToGrow}
          </h2>

          <p>
            {t.growText}
          </p>

        </div>

        <div className="cta-form">

          <div className="email-input">

            <FaEnvelope />

            <input
              type="email"
              required
              placeholder={
                t.enterEmail
              }
              value={email}
              onChange={(
                event
              ) =>
                setEmail(
                  event.target.value
                )
              }
            />

          </div>

          <button type="submit">

            {t.getStarted}

            <FaArrowRight />

          </button>

        </div>

        {/* SUCCESS */}

        {subStatus ===
          "success" && (
          <p className="sub-message success">
            {t.subscribeSuccess}
          </p>
        )}

        {/* ERROR */}

        {subStatus ===
          "error" && (
          <p className="sub-message error">
            {t.subscribeError}
          </p>
        )}

      </form>

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
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
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

          {/* COMPANY */}

          <div className="footer-column">

            <h3>
              {t.company}
            </h3>

            <Link to="/about">
              {t.aboutUs}
            </Link>

            <a href="#contact">
              {t.contact}
            </a>

            <a href="#contact">
              {t.privacyPolicy}
            </a>

            <a href="#contact">
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