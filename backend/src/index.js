// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import Book from "./models/Book.js";
import Course from "./models/Course.js";
import { jwtAuth, requireRole } from "./middleware/jwtAuth.js";
import {
  protect,
  admin,
  instructor,
  manager,
} from "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import upload from "./middleware/uploadMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// request logging (assign request id + access log)
import cors from "cors";
import requestLogger from "./middleware/requestLogger.js";

// Enable CORS for the frontend dev server (Vite). Override with FRONTEND_ORIGIN env var if needed.
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
// respond to preflight requests
app.options("*", cors(corsOptions));

app.use(requestLogger.assignRequestId);
app.use(requestLogger.httpLogger);

// Route chuyên biệt
// Mount toàn bộ adminRoutes vào /admin, middleware xác thực chỉ dùng cho các route cần bảo vệ trong adminRoutes.js
app.use("/admin", adminRoutes);
app.use("/courses", courseRoutes);
app.use("/exams", jwtAuth, examRoutes);
app.use("/forum", jwtAuth, forumRoutes);
app.use("/news", newsRoutes);
app.use("/notifications", jwtAuth, notificationRoutes);
app.use("/progress", jwtAuth, progressRoutes);
app.use("/shop", shopRoutes);
app.use("/user", userRoutes);
app.use("/stats", statsRoutes);

// Route upload file (chỉ admin) — protected and restricted by role
app.post(
  "/upload",
  jwtAuth,
  requireRole("admin"),
  upload.single("file"),
  (req, res) => {
    res.json({ filename: req.file.filename, path: req.file.path });
  }
);
//

app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

// ...existing code...

// ...existing code...

// Middleware xử lý lỗi 404
app.use(notFound);
// Middleware xử lý lỗi chung
app.use(errorHandler);

connectDB()
  .then(() => {
    // Bind to 0.0.0.0 so the server listens on all network interfaces (IPv4)
    // This helps tools/containers/Windows shells connect via 127.0.0.1 reliably.
    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Connected successfully on port ${PORT}`);
      try {
        const addr = server.address();
        const host = addr.address === "::" ? "0.0.0.0" : addr.address;
        logger.info(
          `Server listening on ${host}:${addr.port} (family: ${addr.family})`
        );
      } catch (err) {
        logger.info(
          `Server listening, but couldn't read server.address(): ${err.message}`
        );
      }
    });
  })
  .catch((err) => {
    logger.error("Error connecting to MongoDB", err);
  });
