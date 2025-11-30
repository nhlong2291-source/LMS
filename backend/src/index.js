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
import { protect, admin, instructor, manager } from "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import upload from "./middleware/uploadMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
//
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Frontend gọi http://localhost:5000/uploads/video.mp4 sẽ xem được
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/upload", uploadRoutes);
// request logging (assign request id + access log)
import cors from "cors";
import requestLogger from "./middleware/requestLogger.js";

// Enable CORS for the frontend dev server. FRONTEND_ORIGIN may contain a
// comma-separated list of allowed origins (e.g. "http://localhost:5173,http://localhost:3000").
// If not set, allow the common dev origins 5173 (Vite) and 3000 (other setups).
const allowedOrigins =
  // Include the common dev ports and the Vite fallback (3001) used by the frontend dev server
  (process.env.FRONTEND_ORIGIN || "http://localhost:5173,http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((s) => s.trim());

const corsOptions = {
  // Use a function so preflight checks compare the exact Origin header value.
  origin(origin, callback) {
    // `origin` will be undefined for same-origin requests from server-side tools
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Not allowed - return error so browser preflight fails clearly.
    return callback(new Error("CORS policy: Origin not allowed"), false);
  },
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
app.use("/enrollments", enrollmentRoutes);
app.use("/exams", jwtAuth, examRoutes);
app.use("/forum", jwtAuth, forumRoutes);
app.use("/news", newsRoutes);
app.use("/notifications", jwtAuth, notificationRoutes);
app.use("/progress", jwtAuth, progressRoutes);
app.use("/shop", shopRoutes);
app.use("/user", userRoutes);
app.use("/stats", statsRoutes);

// Route upload file (chỉ admin) — protected and restricted by role
app.post("/upload", jwtAuth, requireRole("admin"), upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename, path: req.file.path });
});
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
        logger.info(`Server listening on ${host}:${addr.port} (family: ${addr.family})`);
      } catch (err) {
        logger.info(`Server listening, but couldn't read server.address(): ${err.message}`);
      }
    });
  })
  .catch((err) => {
    logger.error("Error connecting to MongoDB", err);
  });
