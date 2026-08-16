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
} from "react-icons/fa";

const products = [
  {
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    title: "Premium Jacket",
    category: "Winter Collection",
    price: "$18.50",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    title: "Warm Winter Coat",
    category: "Men Collection",
    price: "$22.00",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    title: "Kids Collection",
    category: "New Arrival",
    price: "$15.90",
  },
  {
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    title: "Premium Shoes",
    category: "Footwear",
    price: "$19.99",
  },
];

const categories = [
  "Men's Wear",
  "Women's Wear",
  "Kids' Wear",
];

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

const reviews = [
  {
    name: "Ali Market",
    text: "Very good quality products. Prices are also suitable for wholesale.",
  },
  {
    name: "Fashion Store",
    text: "Fast delivery and excellent customer service. Highly recommended.",
  },
  {
    name: "Kids Shop",
    text: "Products arrived safely and quality was better than expected.",
  },
];

function HomePage() {
  return (
    <div className="home-page">

      {/* HEADER */}
      <header className="header">

        <div className="logo">
          <span>Premium</span> Bulk
        </div>

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

          <button className="icon-btn cart-btn">
            <FaShoppingCart />

            <span className="cart-count">
              2
            </span>
          </button>

        </div>

      </header>

      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="small-title">
            WHOLESALE FASHION
          </span>

          <h1>
            Premium Bulk Apparel.
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

            <Link to="/shop" className="secondary-btn">
              Contact Us
              <FaPhoneAlt />
            </Link>

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
              key={index}
            >

              <div className="category-overlay"></div>

              <div className="category-content">

                <span>
                  0{index + 1}
                </span>

                <h3>
                  {category}
                </h3>

                <button>
                  Explore
                  <FaArrowRight />
                </button>

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

          <button className="view-all">
            View All
            <FaArrowRight />
          </button>

        </div>

        <div className="product-grid">

          {products.map((product, index) => (
            <div
              className="product-card"
              key={index}
            >

              <div className="product-image">

                <img
                  src={product.image}
                  alt={product.title}
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

                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />

                  <span>
                    5.0
                  </span>

                </div>

                <div className="product-bottom">

                  <strong>
                    {product.price}
                  </strong>

                  <button>
                    View
                    <FaArrowRight />
                  </button>

                </div>

              </div>

            </div>
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

          {reviews.map((review, index) => (
            <div
              className="review-card"
              key={index}
            >

              <div className="stars">

                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />

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
      <section className="cta">

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
              placeholder="Enter your email"
            />

          </div>

          <button>
            Get Started
            <FaArrowRight />
          </button>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-main">

          <div className="footer-about">

            <div className="footer-logo">
              <span>Premium</span> Bulk
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

            <a href="#about">
              About Us
            </a>

            <a href="#contact">
              Contact
            </a>

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
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

          © 2026 Premium Bulk Apparel.
          All Rights Reserved.

        </div>

      </footer>

    </div>
  );
}

export default HomePage;