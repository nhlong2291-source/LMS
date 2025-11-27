import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { jwtAuth } from "../middleware/jwtAuth.js";

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ error: "Username already exists" });
    const user = new User({
      username,
      password,
      email,
      role: role || "student",
    });
    await user.save();
    res.status(201).json({ message: "Register success" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { username: user.username, role: user.role },
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

export default router;
