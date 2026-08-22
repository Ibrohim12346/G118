import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaStar,
  FaSlidersH,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";

import "./ShopPage.css";

import {
  getProducts,
  getCategories,
  subscribe,
} from "../api.js";
import { addToCart, getCartCount } from "../cart.js";

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState(null);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [sortBy, setSortBy] = useState("featured");
  const [likedProducts, setLikedProducts] = useState([]);

  function toggleLiked(id) {
    setLikedProducts((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productData.data?.items ?? productData.data ?? []);
        setCategories(categoryData.data?.items ?? categoryData.data ?? []);
      } catch {
        setError(
          "Backend bilan bog'lanib bo'lmadi. Serverni ishga tushiring."
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

  function toggleCategory(category) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await getProducts({ search });
      setProducts(data.data?.items ?? data.data ?? []);
    } catch {
      setError("Qidiruvda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }

  function handleApplyFilter() {
    setLoading(true);
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    const filtered = products.filter((product) => {
      const price = Number(product.wholesale_price ?? product.price);
      const inCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      return price >= min && price <= max && inCategory;
    });
    setProducts(filtered);
    setLoading(false);
  }

  function handleClear() {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSortBy("featured");
    setLoading(true);
    getProducts()
      .then((data) => setProducts(data.data?.items ?? data.data ?? []))
      .catch(() => setError("Xatolik yuz berdi."))
      .finally(() => setLoading(false));
  }

  function handleSort(value) {
    setSortBy(value);
    setProducts((current) => {
      const sorted = [...current];
      if (value === "low-high") {
        sorted.sort(
          (a, b) =>
            Number(a.wholesale_price ?? a.price) -
            Number(b.wholesale_price ?? b.price)
        );
      } else if (value === "high-low") {
        sorted.sort(
          (a, b) =>
            Number(b.wholesale_price ?? b.price) -
            Number(a.wholesale_price ?? a.price)
        );
      } else if (value === "newest") {
        sorted.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }
      return sorted;
    });
  }

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
    <div className="shop-page">

      {/* HEADER */}
      <header className="shop-header">
        <Link to="/" className="shop-logo">
          <span>Premium</span> Store
        </Link>

        <nav className="shop-nav">
          <Link to="/">Home</Link>
          <Link to="/shop">Products</Link>
          <Link to="/#categories">Categories</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact">Contact</Link>
        </nav>

        <div className="header-actions">
          <button className="header-icon">
            <FaSearch />
          </button>

          <button className="header-icon">
            <FaUser />
          </button>

          <Link to="/savat" className="header-icon cart-icon">
            <FaShoppingCart />
            <span>{cartCount}</span>
          </Link>
        </div>
      </header>

      {/* TOP BAR */}
      <div className="top-bar">
        <span>
          Home / <b>Shop</b>
        </span>

        <form className="top-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </div>

      {/* SHOP CONTENT */}
      <main className="shop-container">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <div className="filter-title">
            <div>
              <FaSlidersH />
              <h3>Filters</h3>
            </div>

            <button type="button" onClick={handleClear}>Clear</button>
          </div>

          {/* CATEGORY */}
          <div className="filter-box">
            <h4>Categories</h4>

            {categories.map((category) => (
              <label
                className="check-row"
                key={category.id ?? category.name}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => toggleCategory(category.name)}
                />

                <span className="custom-check">
                  <FaCheck />
                </span>

                <span>{category.name}</span>
              </label>
            ))}
          </div>

          {/* PRICE */}
          <div className="filter-box">
            <h4>Price Range</h4>

            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />

              <span>-</span>

              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="apply-btn"
              onClick={handleApplyFilter}
            >
              Apply Filter
            </button>
          </div>

        </aside>

        {/* PRODUCTS AREA */}
        <section
          className="products-area"
          id="products"
        >

          {/* PRODUCTS HEADER */}
          <div className="products-header">

            <div>
              <p>Showing {products.length} products</p>

              <h1>
                Shop Collection
              </h1>
            </div>

            <div className="products-tools">

              <div className="sort-box">
                <span>Sort by:</span>

                <select
                  value={sortBy}
                  onChange={(event) => handleSort(event.target.value)}
                >
                  <option value="featured">
                    Featured
                  </option>

                  <option value="low-high">
                    Price: Low to High
                  </option>

                  <option value="high-low">
                    Price: High to Low
                  </option>

                  <option value="newest">
                    Newest
                  </option>
                </select>

                <FaChevronDown />
              </div>

            </div>
          </div>

          {error && <p className="api-error">{error}</p>}

          {loading && <p className="loading-text">Loading products...</p>}

          {/* PRODUCT GRID */}
          <div className="product-grid">

            {products.map((product) => (
              <article
                className="product-card"
                key={product.id}
              >

                <Link
                  to={`/mahsulodlari/${product.id}`}
                  className="product-image"
                >

                  <img
                    src={product.image_url || product.image}
                    alt={product.title}
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e";
                    }}
                  />

                  {product.wholesale_price && (
                    <span className="product-badge">
                      WHOLESALE
                    </span>
                  )}

                  <button
                    className={`heart-button ${
                      likedProducts.includes(product.id) ? "active" : ""
                    }`}
                    onClick={(event) => {
                      event.preventDefault();
                      toggleLiked(product.id);
                    }}
                  >
                    <FaHeart />
                  </button>

                </Link>

                <div className="product-content">

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>
                    {product.title}
                  </h3>

                  <div className="rating">
                    {Array.from({
                      length: 5,
                    }).map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index <
                          Math.round(product.rating ?? 5)
                            ? "star active"
                            : "star"
                        }
                      />
                    ))}

                    <span>
                      ({(product.reviews_count ?? 0)})
                    </span>
                  </div>

                  <div className="product-bottom">

                    <div className="prices">
                      <strong>
                        {formatPrice(product.wholesale_price ?? product.price)}
                      </strong>

                      {product.wholesale_price && (
                        <del>
                          {formatPrice(product.price)}
                        </del>
                      )}
                    </div>

                    <button
                      className="add-cart"
                      onClick={() => addToCart(product)}
                    >
                      <FaShoppingCart />
                      Add
                    </button>

                  </div>

                </div>
              </article>
            ))}

          </div>

          {products.length === 0 && !loading && (
              <p className="no-products">
                Hech qanday mahsulot topilmadi. Filtrlarni o'zgartirib qayta urinib ko'ring.
              </p>
            )}

        </section>
      </main>

      {/* NEWSLETTER */}
      <section className="newsletter">

        <div>
          <span>PREMIUM STORE</span>

          <h2>
            Get 10% Off Your First Order
          </h2>

          <p>
            Subscribe to our newsletter and
            receive exclusive offers.
          </p>
        </div>

        <form
          className="newsletter-form"
          onSubmit={handleSubscribe}
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button type="submit">
            Subscribe
          </button>
        </form>

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

      </section>

      {/* FOOTER */}
      <footer className="shop-footer">

        <div className="footer-brand">
          <h2>
            <span>Premium</span> Store
          </h2>

          <p>
            Quality fashion products at
            affordable wholesale prices.
          </p>
        </div>

        <div className="footer-links">
          <h3>Shop</h3>
          <Link to="/shop">All Products</Link>
          <Link to="/shop">Men</Link>
          <Link to="/shop">Women</Link>
          <Link to="/shop">Kids</Link>
        </div>

        <div className="footer-links">
          <h3>Company</h3>
          <Link to="/">About Us</Link>
          <Link to="/#contact">Contact</Link>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms</a>
        </div>

        <div className="footer-links">
          <h3>Contact</h3>
          <a href="tel:+998990924985">
            +998 99 092 49 85
          </a>
          <a href="mailto:info@example.com">
            info@example.com
          </a>
          <span>
            Tashkent, Uzbekistan
          </span>
        </div>

      </footer>

      <div className="copyright">
        © 2026 Premium Store. All Rights Reserved.
      </div>

    </div>
  );
}

export default ShopPage;