import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be at most 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      index: true,
      match: [/^\+?[0-9\s\-()]{7,20}$/, "Phone is invalid"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address must be at most 500 characters"],
      default: "",
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: [0, "totalOrders must be greater than or equal to 0"],
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: [0, "totalSpent must be greater than or equal to 0"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;