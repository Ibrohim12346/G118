import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [200, "Name must be at most 200 characters"],
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug is invalid"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description must be at most 5000 characters"],
      default: "",
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    wholesalePrice: {
      type: Number,
      required: [true, "Wholesale price is required"],
      min: [0, "Wholesale price must be greater than or equal to 0"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      default: 0,
      min: [0, "Stock must be greater than or equal to 0"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      minlength: [3, "SKU must be at least 3 characters"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.pre("validate", function validatePrices(next) {
  if (
    this.isModified("wholesalePrice") ||
    this.isModified("price") ||
    this.isNew
  ) {
    if (this.wholesalePrice > this.price) {
      this.invalidate(
        "wholesalePrice",
        "Wholesale price must not be greater than price"
      );
    }
  }
  return next();
});

productSchema.pre("save", function syncStockStatus(next) {
  if (this.isModified("stock") || this.isNew) {
    if (this.stock <= 0 && this.status !== "inactive") {
      this.status = "out_of_stock";
    } else if (this.stock > 0 && this.status === "out_of_stock") {
      this.status = "active";
    }
  }
  return next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;