// Lấy danh sách forum theo phòng ban, role, trạng thái
export async function getForumsByDepartment(req, res) {
  try {
    const { departments, status } = req.query;
    const { role, department: userDept } = req.user;
    let filter = {};
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    if (status) {
      filter.status = status;
    }
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    if (role === "student") {
      filter.members = req.user._id;
    }
    const forums = await Forum.find(filter);
    res.json(forums);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import logger from "../utils/logger.js";

// Tạo bài đăng thảo luận
export async function createPost(req, res) {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Tạo bình luận cho bài đăng
export async function createComment(req, res) {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Lấy danh sách bài đăng
export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate("comments");
    res.json(posts);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}
