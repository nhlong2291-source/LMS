import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  enrollCourse,
  approveEnrollment,
  getEnrollmentsByDepartment,
  checkEnrollment,
} from "../controllers/enrollmentController.js";

const router = express.Router();

// POST /enrollments/enroll  (frontend expects this path)
router.post("/enroll", jwtAuth, enrollCourse);

// Alternatively support POST /enrollments/ (legacy)
router.post("/", jwtAuth, enrollCourse);

// Check enrollment status: GET /enrollments/check/:courseId
router.get("/check/:courseId", jwtAuth, checkEnrollment);

// Admin approve enrollment
router.post("/approve", jwtAuth, admin, approveEnrollment);

// Admin list pending enrollments
router.get("/pending", jwtAuth, admin, async (req, res) => {
  try {
    // Delegate to controller function which can be added later; simple inline impl for now
    const pendings = await (await import("../models/Enrollment.js")).default
      .find({ status: "pending" })
      .populate("user", "username email")
      .populate("course", "name");
    res.json(pendings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách" });
  }
});

// Filtered listing by department/role/status
router.get("/filter", jwtAuth, getEnrollmentsByDepartment);

export default router;
