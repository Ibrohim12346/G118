import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal must be greater than or equal to 0"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, "Items are required"],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "At least one item is required",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Subtotal must be greater than or equal to 0"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be greater than or equal to 0"],
    },
    deliveryPrice: {
      type: Number,
      default: 0,
      min: [0, "Delivery price must be greater than or equal to 0"],
    },
    total: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Total must be greater than or equal to 0"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "new",
        "confirmed",
        "processing",
        "shipping",
        "completed",
        "cancelled",
      ],
      default: "new",
      index: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
      maxlength: [1000, "Delivery address must be at most 1000 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      match: [/^\+?[0-9\s\-()]{7,20}$/, "Phone is invalid"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;