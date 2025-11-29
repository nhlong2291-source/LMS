import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { getUsersByDepartment } from "../controllers/userController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many login attempts, please try again later." },
});

// Đăng ký
router.post("/register", async (req, res) => {
  const { username, password, email, role, department } = req.body;
  if (!department) {
    return res.status(400).json({ error: "Department is required" });
  }
  try {
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ error: "Username already exists" });
    const user = new User({
      username,
      password,
      email,
      role: role || "student",
      department,
    });
    await user.save();
    res.status(201).json({ message: "Register success" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Đăng nhập
router.post("/login", loginLimiter, async (req, res) => {
  const { username, password, email } = req.body;
  // allow login by username or email
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const match = await user.comparePassword(password);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    {
      _id: user._id,
      username: user.username,
      role: user.role,
      department: user.department,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

// Lấy profile
router.get("/profile", jwtAuth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Cập nhật profile
router.put("/profile", jwtAuth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Đổi mật khẩu
router.put("/change-password", jwtAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ username: req.user.username });
  if (!user || !(await user.comparePassword(oldPassword))) {
    return res.status(400).json({ error: "Old password incorrect" });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: "Password changed" });
});

// Lấy danh sách user theo phòng ban, role, trạng thái
router.get("/filter", jwtAuth, getUsersByDepartment);

export default router;
