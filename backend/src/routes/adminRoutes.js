import express from "express";
import generateToken from "../utils/generateToken.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Route đăng nhập admin
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken({ username: admin.username, role: admin.role });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
