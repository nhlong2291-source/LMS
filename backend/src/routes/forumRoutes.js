import express from "express";
import {
  createPost,
  createComment,
  getAllPosts,
  getForumsByDepartment,
} from "../controllers/forumController.js";
import { jwtAuth } from "../middleware/jwtAuth.js";

const router = express.Router();
// Lọc forum theo phòng ban, role, trạng thái
router.get("/filter", jwtAuth, getForumsByDepartment);

router.post("/posts", jwtAuth, createPost);
router.post("/comments", jwtAuth, createComment);
router.get("/posts", getAllPosts);

export default router;
