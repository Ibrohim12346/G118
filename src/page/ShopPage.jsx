import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaStar,
  FaSlidersH,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaThLarge,
  FaList,
  FaCheck,
} from "react-icons/fa";

import "./ShopPage.css";

const products = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
    title: "Black & Navy Tailored Blazer",
    category: "Women's Clothing",
    price: "$15.50",
    oldPrice: "$22.00",
    rating: 5,
    reviews: 24,
    badge: "SALE",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    title: "Premium White Shirt",
    category: "Men's Clothing",
    price: "$12.90",
    oldPrice: "$18.00",
    rating: 5,
    reviews: 31,
    badge: "NEW",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    title: "Elegant Red Dress",
    category: "Women's Clothing",
    price: "$18.50",
    oldPrice: "$25.00",
    rating: 4,
    reviews: 18,
    badge: "SALE",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
    title: "Premium Beige Jacket",
    category: "Women's Clothing",
    price: "$21.00",
    oldPrice: "$29.00",
    rating: 5,
    reviews: 42,
    badge: "NEW",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=700&q=80",
    title: "Classic Black Sweater",
    category: "Men's Clothing",
    price: "$14.90",
    oldPrice: "$20.00",
    rating: 4,
    reviews: 16,
    badge: "SALE",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=700&q=80",
    title: "Elegant Women's Coat",
    category: "Women's Clothing",
    price: "$24.90",
    oldPrice: "$32.00",
    rating: 5,
    reviews: 37,
    badge: "HOT",
  },
];

const categories = [
  "All Products",
  "Men's Clothing",
  "Women's Clothing",
  "Kids' Clothing",
  "Shoes",
  "Bags",
];

function ShopPage() {
  return (
    <div className="shop-page">

      {/* HEADER */}
      <header className="shop-header">
        <div className="shop-logo">
          <span>Premium</span>
          Store
        </div>

        <nav className="shop-nav">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <button className="header-icon">
            <FaSearch />
          </button>

          <button className="header-icon">
            <FaUser />
          </button>

          <button className="header-icon cart-icon">
            <FaShoppingCart />
            <span>2</span>
          </button>
        </div>
      </header>

      {/* TOP BAR */}
      <div className="top-bar">
        <span>
          Home / <b>Shop</b>
        </span>

        <div className="top-search">
          <input
            type="text"
            placeholder="Search products..."
          />
          <button>
            <FaSearch />
          </button>
        </div>
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

            <button>Clear</button>
          </div>

          {/* CATEGORY */}
          <div className="filter-box">
            <h4>Categories</h4>

            {categories.map((category, index) => (
              <label
                className="check-row"
                key={category}
              >
                <input
                  type="checkbox"
                  defaultChecked={index === 0}
                />

                <span className="custom-check">
                  <FaCheck />
                </span>

                <span>{category}</span>
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
              />

              <span>-</span>

              <input
                type="number"
                placeholder="Max"
              />
            </div>

            <button className="apply-btn">
              Apply Filter
            </button>
          </div>

          {/* SIZE */}
          <div className="filter-box">
            <h4>Size</h4>

            <div className="sizes">
              {["S", "M", "L", "XL", "XXL"].map(
                (size) => (
                  <button key={size}>
                    {size}
                  </button>
                )
              )}
            </div>
          </div>

          {/* COLOR */}
          <div className="filter-box">
            <h4>Color</h4>

            <div className="colors">
              <button className="color black"></button>
              <button className="color white"></button>
              <button className="color red"></button>
              <button className="color blue"></button>
              <button className="color green"></button>
              <button className="color yellow"></button>
            </div>
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
              <p>Showing 1–6 of 24 products</p>

              <h1>
                Shop Collection
              </h1>
            </div>

            <div className="products-tools">

              <button className="view-button active">
                <FaThLarge />
              </button>

              <button className="view-button">
                <FaList />
              </button>

              <div className="sort-box">
                <span>Sort by:</span>

                <select>
                  <option>
                    Featured
                  </option>

                  <option>
                    Price: Low to High
                  </option>

                  <option>
                    Price: High to Low
                  </option>

                  <option>
                    Newest
                  </option>
                </select>

                <FaChevronDown />
              </div>

            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="product-grid">

            {products.map((product) => (
              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.title}
                  />

                  <span className="product-badge">
                    {product.badge}
                  </span>

                  <button className="heart-button">
                    <FaHeart />
                  </button>

                  <button className="quick-view">
                    Quick View
                  </button>

                </div>

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
                          product.rating
                            ? "star active"
                            : "star"
                        }
                      />
                    ))}

                    <span>
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="product-bottom">

                    <div className="prices">
                      <strong>
                        {product.price}
                      </strong>

                      <del>
                        {product.oldPrice}
                      </del>
                    </div>

                    <button className="add-cart">
                      <FaShoppingCart />
                      Add
                    </button>

                  </div>

                </div>
              </article>
            ))}

          </div>

          {/* PAGINATION */}
          <div className="pagination">

            <button>
              <FaChevronLeft />
            </button>

            <button className="page-active">
              1
            </button>

            <button>
              2
            </button>

            <button>
              3
            </button>

            <span>...</span>

            <button>
              8
            </button>

            <button>
              <FaChevronRight />
            </button>

          </div>

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

        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
          />

          <button>
            Subscribe
          </button>
        </div>

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
          <a href="#products">All Products</a>
          <a href="#">Men</a>
          <a href="#">Women</a>
          <a href="#">Kids</a>
        </div>

        <div className="footer-links">
          <h3>Company</h3>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
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