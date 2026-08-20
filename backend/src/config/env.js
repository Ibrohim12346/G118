import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/odega",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "30m",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "14d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

export default env;