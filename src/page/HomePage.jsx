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
} from "react-icons/fa";

import {
  getProducts,
  getCategories,
  getReviews,
  subscribe,
} from "../api.js";
import { getCartCount } from "../cart.js";

const features = [
  {
    icon: <FaTruck />,
    title: "Fast Delivery",
    text: "We provide fast and reliable delivery for wholesale orders.",
  },
  {
    icon: <FaTags />,
    title: "Best Wholesale Price",
    text: "Affordable prices for businesses and bulk buyers.",
  },
  {
    icon: <FaStar />,
    title: "Premium Quality",
    text: "High-quality products carefully selected for our customers.",
  },
];

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState(null);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [productData, categoryData, reviewData] = await Promise.all([
          getProducts({ featured: "true" }),
          getCategories(),
          getReviews(),
        ]);
        setProducts(productData.results ?? productData);
        setCategories(categoryData.results ?? categoryData);
        setCustomerReviews(reviewData.results ?? reviewData);
      } catch {
        setError(
          "Backend bilan bog'lanib bo'lmadi. Django serverini ishga tushiring."
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const onCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", onCartUpdate);
    return () => window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

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

  return (
    <div className="home-page">

      {/* HEADER */}
      <header className="header">

        <Link to="/" className="logo">
          <span>Premium</span> Store
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/mahsulodlari">Products</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/savat">Cart</Link>
        </nav>

        <div className="header-icons">

          <button className="icon-btn">
            <FaSearch />
          </button>

          <button className="icon-btn">
            <FaUser />
          </button>

          <Link to="/savat" className="icon-btn cart-btn">
            <FaShoppingCart />

            <span className="cart-count">
              {cartCount}
            </span>
          </Link>

        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <FaBars />
        </button>

      </header>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/mahsulodlari" onClick={() => setMenuOpen(false)}>Products</Link>
        <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
        <Link to="/savat" onClick={() => setMenuOpen(false)}>Cart</Link>
      </div>

      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="small-title">
            WHOLESALE FASHION
          </span>

          <h1>
            Premium Store Apparel.
            <br />
            Delivered at Scale.
          </h1>

          <p>
            Quality clothing at wholesale prices.
            <br />
            Built for retailers, stores and businesses.
          </p>

          <div className="hero-buttons">

            <Link to="/mahsulodlari" className="primary-btn">
              View Products
              <FaArrowRight />
            </Link>

            <a href="#contact" className="secondary-btn">
              Contact Us
              <FaPhoneAlt />
            </a>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="features">

        {features.map((item, index) => (
          <div
            className="feature-card"
            key={index}
          >

            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </div>
        ))}

      </section>

      {/* CATEGORIES */}
      <section
        className="categories"
        id="categories"
      >

        <div className="section-title">

          <span>
            SHOP BY CATEGORY
          </span>

          <h2>
            Wholesale Categories
          </h2>

        </div>

        <div className="category-grid">

          {categories.map((category, index) => (
            <div
              className={`category-card category-${index + 1}`}
              key={category.id ?? index}
            >

              <div className="category-overlay"></div>

              <div className="category-content">

                <span>
                  0{index + 1}
                </span>

                <h3>
                  {category.name}
                </h3>

                <Link to="/shop">
                  Explore
                  <FaArrowRight />
                </Link>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* PRODUCTS */}
      <section
        className="products"
        id="products"
      >

        <div className="section-heading">

          <div>

            <span>
              OUR COLLECTION
            </span>

            <h2>
              Top Wholesale Products
            </h2>

          </div>

          <Link to="/shop" className="view-all">
            View All
            <FaArrowRight />
          </Link>

        </div>

        {error && <p className="api-error">{error}</p>}

        {loading && <p className="loading-text">Loading products...</p>}

        <div className="product-grid">

          {products.map((product, index) => (
            <Link
              to={`/mahsulodlari/${product.id}`}
              className="product-card"
              key={product.id ?? index}
            >

              <div className="product-image">

                <img
                  src={product.image_url || product.image}
                  alt={product.title}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e";
                  }}
                />

                <span className="badge">
                  WHOLESALE
                </span>

                <button className="product-heart">
                  <FaHeart />
                </button>

              </div>

              <div className="product-info">

                <span className="product-category">
                  {product.category}
                </span>

                <h3>
                  {product.title}
                </h3>

                <div className="product-rating">

                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={
                        starIndex < Math.round(product.rating ?? 5)
                          ? "star active"
                          : "star"
                      }
                    />
                  ))}

                  <span>
                    {(product.rating ?? 5).toFixed(1)}
                  </span>

                </div>

                <div className="product-bottom">

                  <strong>
                    {formatPrice(product.wholesale_price ?? product.price)}
                  </strong>

                  <span className="view-btn">
                    View
                    <FaArrowRight />
                  </span>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* REVIEWS */}
      <section
        className="reviews"
        id="reviews"
      >

        <div className="section-title">

          <span>
            WHAT OUR CUSTOMERS SAY
          </span>

          <h2>
            Customer Reviews
          </h2>

        </div>

        <div className="review-grid">

          {customerReviews.map((review, index) => (
            <div
              className="review-card"
              key={review.id ?? index}
            >

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

              <p>
                "{review.text}"
              </p>

              <div className="review-user">

                <div className="avatar">
                  {review.name.charAt(0)}
                </div>

                <div>

                  <strong>
                    {review.name}
                  </strong>

                  <span>
                    <FaCheck />
                    Verified Customer
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* CTA */}
      <form className="cta" onSubmit={handleSubscribe}>

        <div className="cta-content">

          <span>
            PREMIUM WHOLESALE
          </span>

          <h2>
            Ready to Grow Your Business?
          </h2>

          <p>
            Get premium apparel at competitive
            wholesale prices and grow your
            business with us.
          </p>

        </div>

        <div className="cta-form">

          <div className="email-input">

            <FaEnvelope />

            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

          </div>

          <button type="submit">
            Get Started
            <FaArrowRight />
          </button>

        </div>

        {subStatus === "success" && (
          <p className="sub-message success">
            ✓ Obuna bo'ldingiz! Rahmat.
          </p>
        )}

        {subStatus === "error" && (
          <p className="sub-message error">
            Xatolik yuz berdi. Qaytadan urinib ko'ring.
          </p>
        )}

      </form>

      {/* FOOTER */}
      <footer className="footer" id="contact">

        <div className="footer-main">

          <div className="footer-about">

            <div className="footer-logo">
              <span>Premium</span> Store
            </div>

            <p>
              Your trusted wholesale clothing
              partner. Premium quality apparel
              delivered at scale.
            </p>

            <div className="socials">

              <a href="#">
                <FaFacebookF />
              </a>

              <a href="#">
                <FaTwitter />
              </a>

              <a href="#">
                <FaInstagram />
              </a>

              <a href="#">
                <FaLinkedinIn />
              </a>

            </div>

          </div>

          <div className="footer-column">

            <h3>
              Quick Links
            </h3>

            <a href="#home">
              Home
            </a>

            <a href="#products">
              Products
            </a>

            <a href="#categories">
              Categories
            </a>

            <a href="#reviews">
              Reviews
            </a>

          </div>

          <div className="footer-column">

            <h3>
              Company
            </h3>

            <a href="#products">
              About Us
            </a>

            <a href="#contact">
              Contact
            </a>

            <a href="#contact">
              Privacy Policy
            </a>

            <a href="#contact">
              Terms
            </a>

          </div>

          <div className="footer-column">

            <h3>
              Contact
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

        <div className="copyright">

          © 2026 Premium Store Apparel.
          All Rights Reserved.

        </div>

      </footer>

    </div>
  );
}

export default HomePage;