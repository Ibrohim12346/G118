import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import { getPagination, buildPagination } from "../utils/pagination.js";
import { generateOrderNumber } from "../utils/generate.js";

const syncProductStatuses = async (productIds) => {
  const products = await Product.find({ _id: { $in: productIds } });
  for (const product of products) {
    const shouldUpdate =
      (product.stock === 0 && product.status === "active") ||
      (product.stock > 0 && product.status === "out_of_stock");
    if (shouldUpdate) {
      await Product.updateOne(
        { _id: product._id },
        { status: product.stock === 0 ? "out_of_stock" : "active" }
      );
    }
  }
};

const adjustCustomerTotals = async (customerId, { ordersDelta, spentDelta }) => {
  const customer = await Customer.findById(customerId);
  if (!customer) return;
  customer.totalOrders = Math.max(0, customer.totalOrders + ordersDelta);
  customer.totalSpent = Math.max(0, customer.totalSpent + spentDelta);
  await customer.save();
};

export const listOrders = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.customer) filter.customer = query.customer;
  if (query.orderStatus) filter.orderStatus = query.orderStatus;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.search) filter.orderNumber = new RegExp(query.search, "i");
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const [data, total] = await Promise.all([
    Order.find(filter)
      .populate("customer", "name phone")
      .populate("items.product", "name sku price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);
  return { data, pagination: buildPagination(page, limit, total) };
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("customer")
    .populate("items.product")
    .populate("createdBy", "name email role");
  if (!order) throw new ApiError(404, "Order not found");
  return order;
};

export const createOrder = async (data, userId) => {
  const customer = await Customer.findById(data.customer);
  if (!customer) {
    throw new ApiError(400, "Invalid customer", { customer: "Customer does not exist" });
  }

  const productDocs = await Promise.all(
    data.items.map((entry) => Product.findById(entry.product))
  );

  const items = data.items.map((entry, i) => {
    const product = productDocs[i];
    if (!product) {
      throw new ApiError(400, "Invalid product", {
        items: `Product at index ${i} does not exist`,
      });
    }
    if (product.stock < entry.quantity) {
      throw new ApiError(409, `Insufficient stock for "${product.name}"`, {
        items: `Only ${product.stock} left for "${product.name}"`,
      });
    }
    return {
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity: entry.quantity,
      price: product.price,
      subtotal: product.price * entry.quantity,
    };
  });

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer: customer._id,
    items,
    discount: data.discount || 0,
    deliveryPrice: data.deliveryPrice || 0,
    paymentStatus: data.paymentStatus || "pending",
    deliveryAddress: data.deliveryAddress,
    phone: data.phone,
    createdBy: userId,
  });

  for (let i = 0; i < productDocs.length; i += 1) {
    productDocs[i].stock -= data.items[i].quantity;
    await productDocs[i].save();
  }

  await adjustCustomerTotals(customer._id, {
    ordersDelta: 1,
    spentDelta: order.total,
  });

  return order;
};

export const updateOrder = async (id, data) => {
  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, "Order not found");

  if (data.orderStatus !== undefined) order.orderStatus = data.orderStatus;
  if (data.paymentStatus !== undefined) order.paymentStatus = data.paymentStatus;
  if (data.deliveryAddress !== undefined) order.deliveryAddress = data.deliveryAddress;
  if (data.phone !== undefined) order.phone = data.phone;
  if (data.discount !== undefined) order.discount = data.discount;
  if (data.deliveryPrice !== undefined) order.deliveryPrice = data.deliveryPrice;

  await order.save();
  return order;
};

export const cancelOrder = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.orderStatus === "cancelled") throw new ApiError(400, "Order is already cancelled");
  if (order.orderStatus === "completed") throw new ApiError(400, "Cannot cancel a completed order");

  const wasCompleted = order.orderStatus === "completed";
  order.orderStatus = "cancelled";
  await order.save();

  for (const item of order.items) {
    await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
  }
  await syncProductStatuses(order.items.map((item) => item.product));

  await adjustCustomerTotals(order.customer, {
    ordersDelta: wasCompleted ? 0 : -1,
    spentDelta: wasCompleted ? 0 : -order.total,
  });

  return order;
};