import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { notFoundHandler, errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: env.nodeEnv === "production" ? env.clientOrigin : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorMiddleware);

export default app;