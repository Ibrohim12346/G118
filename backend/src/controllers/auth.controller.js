import * as authService from "../services/auth.service.js";
import * as userService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const clientMeta = (req) => ({
  userAgent: req.get("user-agent"),
  ipAddress: req.ip,
});

export const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body, clientMeta(req));
  res.status(201).json({ success: true, data });
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body, clientMeta(req));
  res.json({ success: true, data });
});

export const refresh = asyncHandler(async (req, res) => {
  const data = await authService.refresh(req.body, clientMeta(req));
  res.json({ success: true, data });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body);
  res.json({ success: true, data: null });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.json({ success: true, data: user });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.json({ success: true, data: user });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  res.json({ success: true, data: null, message: "Password changed successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body);
  res.json({ success: true, data });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.json({ success: true, data: null, message: "Password reset successfully" });
});