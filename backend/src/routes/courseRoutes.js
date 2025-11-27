import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  checkAdminRole,
  createModule,
  createLesson,
} from "../controllers/courseController.js";
import { rewardGemOnCourseComplete } from "../controllers/rewardController.js";
import { jwtAuth } from "../middleware/jwtAuth.js";

const router = express.Router();

router.post("/", jwtAuth, checkAdminRole, createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.put("/:id", jwtAuth, checkAdminRole, updateCourse);
router.delete("/:id", jwtAuth, checkAdminRole, deleteCourse);

// Tạo module cho course
router.post("/:courseId/modules", jwtAuth, checkAdminRole, createModule);
// Tạo lesson cho module
router.post(
  "/:courseId/modules/:moduleId/lessons",
  jwtAuth,
  checkAdminRole,
  createLesson
);
// Tặng GEM khi hoàn thành toàn bộ khóa học
router.post("/:courseId/reward", jwtAuth, rewardGemOnCourseComplete);

export default router;
