import * as orderService from "../services/order.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const data = await orderService.listOrders(req.query);
  res.json({ success: true, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res.json({ success: true, data: order });
});

export const create = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user._id);
  res.status(201).json({ success: true, data: order });
});

export const update = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrder(req.params.id, req.body);
  res.json({ success: true, data: order });
});

export const cancel = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id);
  res.json({ success: true, data: order });
});