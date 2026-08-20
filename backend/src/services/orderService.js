import { Order, Product, Customer, User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationOptions } from "../utils/helpers.js";
import { assertExists } from "../utils/db.js";
import { ORDER_STATUSES } from "../constants/index.js";

const ORDER_POPULATE = [
  { path: "customer", select: "name phone email address" },
  { path: "items.product", select: "name slug sku price images" },
  { path: "createdBy", select: "name email" },
];

export async function listOrders(query) {
  const { page, limit, skip } = paginationOptions(query);
  const filter = {};

  if (query.customer) filter.customer = query.customer;
  if (query.orderStatus) filter.orderStatus = query.orderStatus;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.orderNumber) {
    filter.orderNumber = { $regex: query.orderNumber, $options: "i" };
  }
  if (query.search) {
    filter.$or = [{ orderNumber: { $regex: query.search, $options: "i" } }];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).populate(ORDER_POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  return {
    items: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getOrder(id) {
  const order = await Order.findById(id).populate(ORDER_POPULATE);
  if (!order) throw new ApiError(404, "Order not found");
  return order;
}

export async function getOrderByNumber(orderNumber) {
  const order = await Order.findOne({ orderNumber }).populate(ORDER_POPULATE);
  if (!order) throw new ApiError(404, "Order not found");
  return order;
}

async function generateOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `OD-${datePart}-${suffix}`;
    const exists = await Order.exists({ orderNumber });
    if (!exists) return orderNumber;
  }
  throw new ApiError(500, "Failed to generate a unique order number");
}

async function resolveItems(items) {
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } }).lean();

  if (products.length !== new Set(productIds.map(String)).size) {
    throw new ApiError(400, "One or more products were not found");
  }

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  return items.map((item) => {
    const product = productMap.get(item.product.toString());
    if (!product) throw new ApiError(400, "Product not found");

    const quantity = Number(item.quantity);
    const price = Number(product.price);
    const subtotal = quantity * price;

    return {
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity,
      price,
      subtotal,
    };
  });
}

export async function createOrder(data, actor) {
  const resolvedItems = await resolveItems(data.items);
  const subtotal = resolvedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = Number(data.discount || 0);
  const deliveryPrice = Number(data.deliveryPrice || 0);
  const total = subtotal - discount + deliveryPrice;

  if (total < 0) {
    throw new ApiError(400, "Total cannot be negative", {
      discount: "Discount must not exceed subtotal plus delivery price",
    });
  }

  const customer = await Customer.findById(data.customer);
  if (!customer) throw new ApiError(404, "Customer not found");

  const order = await Order.create({
    orderNumber: await generateOrderNumber(),
    customer: data.customer,
    items: resolvedItems,
    subtotal,
    discount,
    deliveryPrice,
    total,
    paymentStatus: data.paymentStatus || "pending",
    orderStatus: data.orderStatus || "new",
    deliveryAddress: data.deliveryAddress,
    phone: data.phone,
    createdBy: actor?._id || null,
  });

  await Customer.findByIdAndUpdate(customer._id, {
    $inc: { totalOrders: 1, totalSpent: total },
  });

  for (const item of resolvedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  return Order.findById(order._id).populate(ORDER_POPULATE);
}

export async function updateOrder(id, data) {
  const order = await assertExists(Order, id, "Order not found");

  if (data.discount !== undefined || data.deliveryPrice !== undefined) {
    const discount = data.discount !== undefined ? Number(data.discount) : order.discount;
    const deliveryPrice =
      data.deliveryPrice !== undefined ? Number(data.deliveryPrice) : order.deliveryPrice;
    const total = order.subtotal - discount + deliveryPrice;
    if (total < 0) {
      throw new ApiError(400, "Total cannot be negative");
    }
    order.discount = discount;
    order.deliveryPrice = deliveryPrice;
    order.total = total;
  }

  for (const key of ["orderStatus", "paymentStatus"]) {
    if (data[key] !== undefined) order[key] = data[key];
  }

  await order.save();
  return Order.findById(order._id).populate(ORDER_POPULATE);
}

export async function cancelOrder(id) {
  const order = await assertExists(Order, id, "Order not found");
  if (order.orderStatus === "cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }

  order.orderStatus = "cancelled";
  await order.save();

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  return Order.findById(order._id).populate(ORDER_POPULATE);
}

export async function deleteOrder(id) {
  const order = await assertExists(Order, id, "Order not found");
  await order.deleteOne();
  return { success: true };
}

export { ORDER_STATUSES };