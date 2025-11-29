import express from "express";
import {
  createNews,
  getAllNews,
  updateNews,
  deleteNews,
  publishNews,
  getNewsByDepartment,
} from "../controllers/newsController.js";
import { jwtAuth, requireRole } from "../middleware/jwtAuth.js";

const router = express.Router();
// Lọc tin tức theo phòng ban, role, trạng thái
router.get("/filter", jwtAuth, getNewsByDepartment);

router.post("/", jwtAuth, requireRole("admin"), createNews);
router.get("/", getAllNews);
router.put("/:id", jwtAuth, requireRole("admin"), updateNews);
router.delete("/:id", jwtAuth, requireRole("admin"), deleteNews);
router.post("/:id/publish", jwtAuth, requireRole("admin"), publishNews);

export default router;
