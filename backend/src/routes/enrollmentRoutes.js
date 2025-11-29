// Lọc danh sách đăng ký theo phòng ban, role, trạng thái
router.get("/filter", jwtAuth, getEnrollmentsByDepartment);
import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import {
  enrollCourse,
  approveEnrollment,
  getEnrollmentsByDepartment,
} from "../controllers/enrollmentController.js";

const router = express.Router();

// Đăng ký khóa học
router.post("/enroll", jwtAuth, enrollCourse);
// Duyệt đăng ký
router.post("/approve", jwtAuth, approveEnrollment);
// Lọc danh sách đăng ký theo phòng ban, role, trạng thái
router.get("/filter", jwtAuth, getEnrollmentsByDepartment);

export default router;
