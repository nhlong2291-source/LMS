import express from "express";
import generateToken from "../utils/generateToken.js";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

import {
  importUsers,
  getUsersByDepartment,
} from "../controllers/adminController.js";
import { jwtAuth, requireRole } from "../middleware/jwtAuth.js";

const router = express.Router();

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: { error: "Too many login attempts, please try again later." },
});
// Lọc user theo phòng ban, role, trạng thái
router.get("/users/filter", getUsersByDepartment);

// Route đăng nhập admin
router.post("/login", adminLoginLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    // Prefer Admin collection, but allow fallback to User with admin role (tests may create admin as User)
    let admin = await Admin.findOne({ username });
    let source = "admin";
    if (!admin) {
      admin = await User.findOne({ username, role: "admin" });
      source = admin ? "user" : source;
    }
    // removed debug logging
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken({ username: admin.username, role: admin.role });
    return res.json({ token, source });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Import user từ danh sách (chỉ admin)
router.post("/import-users", jwtAuth, requireRole("admin"), importUsers);

export default router;
