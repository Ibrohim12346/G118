import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/token.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authentication required");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.sub).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
  );
  if (!user) throw new ApiError(401, "User no longer exists");
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, "Authentication required"));
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to perform this action"));
  }
  next();
};