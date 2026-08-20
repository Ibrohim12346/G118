import { User } from "../models/index.js";
import { verifyAccessToken } from "../utils/token.js";
import { ApiError } from "../utils/ApiError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ROLES } from "../constants/index.js";

export const protect = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authentication required");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(payload.sub).select("+password");
  if (!user) throw new ApiError(401, "User no longer exists");
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  req.user = user;
  return next();
});

const roleRank = {
  [ROLES.SUPERADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.MANAGER]: 2,
  [ROLES.SELLER]: 1,
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, "Authentication required"));
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "Insufficient permissions"));
  }
  return next();
};

export const requireMinRole = (minRole) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, "Authentication required"));
  if (roleRank[req.user.role] < roleRank[minRole]) {
    return next(new ApiError(403, "Insufficient permissions"));
  }
  return next();
};