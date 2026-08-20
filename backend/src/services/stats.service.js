import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

const REVENUE_MATCH = {
  orderStatus: { $ne: "cancelled" },
  paymentStatus: { $ne: "refunded" },
};

const sumRevenue = (rows) => (rows[0] ? rows[0].total : 0);

export const getStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalRevenue,
    todayRevenue,
    monthRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    totalCategories,
    activeUsers,
    lowStockProducts,
  ] = await Promise.all([
    Order.aggregate([
      { $match: REVENUE_MATCH },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $match: { ...REVENUE_MATCH, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $match: { ...REVENUE_MATCH, createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments(),
    Customer.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    User.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 5 } }),
  ]);

  return {
    revenue: {
      total: sumRevenue(totalRevenue),
      today: sumRevenue(todayRevenue),
      month: sumRevenue(monthRevenue),
    },
    counts: {
      orders: totalOrders,
      customers: totalCustomers,
      products: totalProducts,
      categories: totalCategories,
      activeUsers,
      lowStockProducts,
    },
  };
};

export const getSalesByRange = async (range = "weekly") => {
  const days = range === "monthly" ? 30 : 7;
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const rows = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start },
        orderStatus: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return rows;
};

export const getTopProducts = async (limit = 5) => {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 50);

  const rows = await Order.aggregate([
    { $match: { orderStatus: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        quantity: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.subtotal" },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: safeLimit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: "$product._id",
        name: "$product.name",
        sku: "$product.sku",
        images: "$product.images",
        quantity: 1,
        revenue: 1,
      },
    },
  ]);

  return rows;
};