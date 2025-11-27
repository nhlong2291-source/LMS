// Load environment variables from .env file
dotenv.config();

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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

// Route upload file (chỉ admin)
app.post("/upload", jwtAuth, admin, upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename, path: req.file.path });
});

// Ví dụ sử dụng upload cho route upload file
app.post("/upload", upload.single("file"), (req, res) => {
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
    app.listen(PORT, () => {
      console.log(`Connected successfully on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
