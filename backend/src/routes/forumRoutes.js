import express from "express";
import {
  createPost,
  createComment,
  getAllPosts,
} from "../controllers/forumController.js";
import { jwtAuth } from "../middleware/jwtAuth.js";

const router = express.Router();

router.post("/posts", jwtAuth, createPost);
router.post("/comments", jwtAuth, createComment);
router.get("/posts", getAllPosts);

export default router;
