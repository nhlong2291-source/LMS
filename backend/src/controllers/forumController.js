import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// Tạo bài đăng thảo luận
export async function createPost(req, res) {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
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
    res.status(400).json({ error: err.message });
  }
}

// Lấy danh sách bài đăng
export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate("comments");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
