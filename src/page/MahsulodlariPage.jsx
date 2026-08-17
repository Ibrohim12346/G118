import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaShareAlt,
  FaStar,
  FaMinus,
  FaPlus,
  FaTruck,
  FaShieldAlt,
  FaCheck,
  FaChevronRight,
} from "react-icons/fa";

import "./MahsulodlariPage.css";

import { getProduct, getProducts } from "../api.js";
import { addToCart, getCartCount } from "../cart.js";

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const onCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", onCartUpdate);
    return () => window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    if (!id) {
      getProducts()
        .then((data) => setProducts(data.results ?? data ?? []))
        .catch(() => setError("Mahsulotlar yuklanmadi. Backend mavjud emas."))
        .finally(() => setLoading(false));
      return;
    }

    getProduct(id)
      .then((data) => {
        setProduct(data);
      })
      .catch(() => setError("Mahsulot topilmadi yoki backend mavjud emas."))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, quantity, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      setShared(false);
    }
  }

  if (loading) {
    return (
      <div className="product-page">
        <p className="loading-text">{id ? "Loading product..." : "Loading products..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <p className="api-error">{error}</p>
        <Link to="/shop" className="back-shop">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="product-page">

        <header className="page-header">
          <Link to="/" className="page-logo">
            <span>Premium</span> Store
          </Link>

          <nav className="page-nav">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/mahsulodlari">Products</Link>
          </nav>

          <Link to="/savat" className="page-cart">
            <FaShoppingCart />
            {cartCount > 0 && <span className="page-cart-count">{cartCount}</span>}
          </Link>
        </header>

        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <FaChevronRight />
          <strong>Products</strong>
        </div>

        <div className="products-head">
          <p>Showing {products.length} products</p>
          <h1>Products Collection</h1>
        </div>

        {products.length === 0 && (
          <p className="no-products">
            Hech qanday mahsulot topilmadi.
          </p>
        )}

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
                  <span className="product-badge">WHOLESALE</span>
                )}

                <button
                  className={`heart-button ${
                    likedProducts.includes(product.id) ? "active" : ""
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    setLikedProducts((prev) =>
                      prev.includes(product.id)
                        ? prev.filter((item) => item !== product.id)
                        : [...prev, product.id]
                    );
                  }}
                >
                  <FaHeart />
                </button>
              </Link>

              <div className="product-content">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.title}</h3>

                <div className="rating">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar
                      key={index}
                      className={
                        index < Math.round(product.rating ?? 5)
                          ? "star active"
                          : "star"
                      }
                    />
                  ))}
                  <span>({product.reviews_count ?? 0})</span>
                </div>

                <div className="product-bottom">
                  <div className="prices">
                    <strong>
                      {formatPrice(product.wholesale_price ?? product.price)}
                    </strong>
                    {product.wholesale_price && (
                      <del>{formatPrice(product.price)}</del>
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

      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <p className="api-error">Mahsulot topilmadi.</p>
        <Link to="/shop" className="back-shop">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.image_url
    ? [product.image_url]
    : ["https://images.unsplash.com/photo-1558769132-cb1aea458c5e"];
  const price = Number(product.wholesale_price ?? product.price);
  const total = (price * quantity).toFixed(2);
  const discount =
    product.wholesale_price && Number(product.price) > price
      ? Math.round(
          ((Number(product.price) - price) / Number(product.price)) * 100
        )
      : 0;

  return (
    <div className="product-page">

      {/* Header */}
      <header className="page-header">
        <Link to="/" className="page-logo">
          <span>Premium</span> Store
        </Link>

        <nav className="page-nav">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/mahsulodlari">Products</Link>
        </nav>

        <Link to="/savat" className="page-cart">
          <FaShoppingCart />
          {cartCount > 0 && <span className="page-cart-count">{cartCount}</span>}
        </Link>
      </header>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <FaChevronRight />
        <Link to="/shop">Products</Link>
        <FaChevronRight />
        <span>{product.category}</span>
        <FaChevronRight />
        <strong>{product.title}</strong>
      </div>

      {/* Main Product */}
      <div className="product-container">

        {/* LEFT */}
        <div className="product-gallery">

          <div className="main-image-box">
            <img
              src={selectedImage || images[0]}
              alt={product.title}
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e";
              }}
            />

            <button
              className={`favorite-btn ${liked ? "active" : ""}`}
              onClick={() => setLiked(!liked)}
            >
              <FaHeart />
            </button>

            {product.wholesale_price && (
              <span className="sale-badge">WHOLESALE</span>
            )}
          </div>

          <div className="thumbnail-list">
            {images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${
                  selectedImage === image ? "selected" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`Product ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="product-info">

          <div className="category">
            {product.category?.toUpperCase()} COLLECTION
          </div>

          <h1>{product.title}</h1>

          <div className="sku">
            SKU: <b>{product.id}</b>
          </div>

          <div className="rating-row">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={
                    star <= Math.round(product.rating ?? 5)
                      ? "active"
                      : ""
                  }
                />
              ))}
            </div>

            <strong>{(product.rating ?? 5).toFixed(1)}</strong>
            <span>({product.reviews_count ?? 0} reviews)</span>
          </div>

          <p className="description">
            {product.description ||
              "Premium sifatli mahsulot. Ulgurji narxlarda xarid qilish imkoniyati mavjud."}
          </p>

          {/* Price */}
          <div className="price-section">
            <span className="price">{formatPrice(price)}</span>

            {product.wholesale_price && (
              <>
                <span className="old-price">
                  {formatPrice(product.price)}
                </span>
                <span className="discount">{discount}% OFF</span>
              </>
            )}
          </div>

          <div className="shipping-info">
            <div>
              <FaTruck />
              <span>
                <b>Free Shipping</b>
                <small>Orders over $50</small>
              </span>
            </div>

            <div>
              <FaShieldAlt />
              <span>
                <b>Secure Payment</b>
                <small>100% protected</small>
              </span>
            </div>
          </div>

          {/* Size */}
          <div className="option-section">
            <div className="option-title">
              <b>Size:</b>
              <span>{size}</span>
            </div>

            <div className="size-list">
              {["S", "M", "L", "XL", "XXL"].map((item) => (
                <button
                  key={item}
                  className={size === item ? "active" : ""}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="option-section">

            <div className="option-title">
              <b>Quantity:</b>
            </div>

            <div className="quantity-wrapper">

              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
              >
                <FaMinus />
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
              >
                <FaPlus />
              </button>

            </div>
          </div>

          {/* Total */}
          <div className="total-row">
            <span>Total:</span>
            <strong>${total}</strong>
          </div>

          {/* Buttons */}
          <div className="actions">

            <button
              className={`cart-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              <FaShoppingCart />
              {added ? "Added ✓" : "Add to Cart"}
            </button>

            <Link
              to="/savat"
              className="buy-btn"
              onClick={handleAddToCart}
            >
              Buy Now
            </Link>

            <button className="share-btn" onClick={handleShare}>
              <FaShareAlt />
              {shared && <span className="share-tip">Copied!</span>}
            </button>

          </div>

          <div className="stock">
            <FaCheck />
            In Stock — {product.stock ?? 50} pcs ready to ship
          </div>

        </div>
      </div>

    </div>
  );
}