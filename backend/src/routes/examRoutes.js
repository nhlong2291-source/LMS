import express from "express";
import {
  submitExam,
  gradeExam,
  getExamsByDepartment,
} from "../controllers/examController.js";
import { jwtAuth, requireRole } from "../middleware/jwtAuth.js";

const router = express.Router();

// Nộp bài thi
router.post("/submit", jwtAuth, submitExam);
// Chấm điểm bài thi (admin)
router.post("/grade", jwtAuth, requireRole("admin"), gradeExam);
// Lọc bài thi theo phòng ban, role, trạng thái
router.get("/filter", jwtAuth, getExamsByDepartment);

export default router;
