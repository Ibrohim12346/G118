import * as statsService from "../services/stats.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStats = asyncHandler(async (req, res) => {
  const data = await statsService.getStats();
  res.json({ success: true, data });
});

export const sales = asyncHandler(async (req, res) => {
  const data = await statsService.getSalesByRange(req.query.range);
  res.json({ success: true, data });
});

export const topProducts = asyncHandler(async (req, res) => {
  const data = await statsService.getTopProducts(req.query.limit);
  res.json({ success: true, data });
});