import { useState } from "react";
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

const product = {
  title: "Premium Cotton Blend T-Shirt",
  sku: "TS-8824-BLK",
  price: 4.5,
  oldPrice: 5.2,
  rating: 4.8,
  reviews: 126,
  description:
    "Premium cotton blend materialdan tayyorlangan zamonaviy va qulay futbolka. Kundalik kiyish uchun juda mos.",
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4f4e?w=800",
  ],
};

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const total = (product.price * quantity).toFixed(2);

  return (
    <div className="product-page">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span>
        <FaChevronRight />
        <span>Products</span>
        <FaChevronRight />
        <span>Men's Clothing</span>
        <FaChevronRight />
        <strong>T-Shirt</strong>
      </div>

      {/* Main Product */}
      <div className="product-container">

        {/* LEFT */}
        <div className="product-gallery">

          <div className="main-image-box">
            <img src={selectedImage} alt={product.title} />

            <button
              className={`favorite-btn ${liked ? "active" : ""}`}
              onClick={() => setLiked(!liked)}
            >
              <FaHeart />
            </button>

            <span className="sale-badge">BEST SELLER</span>
          </div>

          <div className="thumbnail-list">
            {product.images.map((image, index) => (
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

          <div className="category">MEN'S COLLECTION</div>

          <h1>{product.title}</h1>

          <div className="sku">
            SKU: <b>{product.sku}</b>
          </div>

          <div className="rating-row">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} />
              ))}
            </div>

            <strong>{product.rating}</strong>
            <span>({product.reviews} reviews)</span>
          </div>

          <p className="description">
            {product.description}
          </p>

          {/* Price */}
          <div className="price-section">
            <span className="price">${product.price.toFixed(2)}</span>
            <span className="old-price">
              ${product.oldPrice.toFixed(2)}
            </span>
            <span className="discount">14% OFF</span>
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

            <button className="cart-btn">
              <FaShoppingCart />
              Add to Cart
            </button>

            <button className="buy-btn">
              Buy Now
            </button>

            <button className="share-btn">
              <FaShareAlt />
            </button>

          </div>

          <div className="stock">
            <FaCheck />
            In Stock — Ready to ship
          </div>

        </div>
      </div>

      {/* Specifications */}
      <section className="specifications">

        <h2>Product Specifications</h2>

        <div className="spec-grid">

          <div>
            <span>Material Composition</span>
            <strong>80% Cotton, 20% Polyester</strong>
          </div>

          <div>
            <span>Fabric</span>
            <strong>Premium Cotton Blend</strong>
          </div>

          <div>
            <span>Fit</span>
            <strong>Regular Fit</strong>
          </div>

          <div>
            <span>Pattern</span>
            <strong>Solid</strong>
          </div>

          <div>
            <span>Color</span>
            <strong>Black</strong>
          </div>

          <div>
            <span>Country of Origin</span>
            <strong>China</strong>
          </div>

          <div>
            <span>Season</span>
            <strong>Spring / Summer</strong>
          </div>

          <div>
            <span>Care Instructions</span>
            <strong>Machine Wash</strong>
          </div>

        </div>

      </section>

    </div>
  );
}