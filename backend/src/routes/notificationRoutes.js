import express from "express";

import {
  getNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
} from "../controllers/notificationController.js";
import { jwtAuth, requireRole } from "../middleware/jwtAuth.js";
const router = express.Router();

// Lấy thông báo của user
router.get("/", jwtAuth, getNotifications);
// Đánh dấu đã đọc
router.put("/:id/read", jwtAuth, markAsRead);
// Tạo thông báo (admin)
router.post("/", jwtAuth, requireRole("admin"), createNotification);
// Xóa thông báo
router.delete("/:id", jwtAuth, deleteNotification);

export default router;
