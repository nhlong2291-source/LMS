import express from "express";

import {
  getProgress,
  updateProgress,
} from "../controllers/progressController.js";
import {
  getTotalProgress,
  getLessonCompletion,
} from "../controllers/progressController.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
const router = express.Router();

// Lấy tiến trình học của user
router.get("/", jwtAuth, getProgress);
// Cập nhật tiến trình học
router.put("/:lessonId", jwtAuth, updateProgress);
// Lấy tổng tiến trình học
router.get("/total", jwtAuth, getTotalProgress);
// Kiểm tra hoàn thành bài học
router.get("/:lessonId/completion", jwtAuth, getLessonCompletion);

export default router;
