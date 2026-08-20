import { catchAsync } from "../utils/catchAsync.js";
import * as authService from "../services/authService.js";

function clientMeta(req) {
  return {
    userAgent: req.headers["user-agent"] || null,
    ipAddress: req.ip || req.socket?.remoteAddress || null,
  };
}

export const register = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body, clientMeta(req));
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const refresh = catchAsync(async (req, res) => {
  const result = await authService.refreshAccessToken(
    req.body.refreshToken,
    clientMeta(req)
  );
  res.status(200).json({
    success: true,
    message: "Tokens refreshed",
    data: result,
  });
});

export const logout = catchAsync(async (req, res) => {
  await authService.logoutUser(req.body.refreshToken);
  res.status(200).json({ success: true, message: "Logged out" });
});

export const me = catchAsync(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);
  res.status(200).json({ success: true, data: user });
});

export const changePassword = catchAsync(async (req, res) => {
  const result = await authService.changePassword(req.user._id, req.body);
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body.email);
  res.status(200).json({
    success: true,
    message: "If the email exists, a reset link has been sent",
    ...(result.token ? { devToken: result.token } : {}),
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res.status(200).json({
    success: true,
    message: "Password has been reset",
    data: result,
  });
});