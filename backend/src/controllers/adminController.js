// Lấy danh sách user theo phòng ban, role, trạng thái (admin)
export async function getUsersByDepartment(req, res) {
  try {
    const { departments, roles, status } = req.query; // ?departments=IT,HR&roles=student,manager&status=active
    const { role, department: userDept } = req.user; // lấy từ JWT
    let filter = {};
    if (departments) {
      filter.department = { $in: departments.split(",") };
    }
    if (roles) {
      filter.role = { $in: roles.split(",") };
    }
    if (status) {
      filter.status = status;
    }
    // Nếu là manager/instructor, chỉ cho xem phòng ban mình quản lý
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    // Nếu là student, chỉ xem bản thân
    if (role === "student") {
      filter._id = req.user._id;
    }
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
import Admin from "../models/Admin.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

// Lấy danh sách tất cả user
export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Import user từ danh sách (JSON)
export async function importUsers(req, res) {
  const { users } = req.body; // [{ username, password, email, role, department }]
  if (!Array.isArray(users)) {
    return res.status(400).json({ error: "users must be an array" });
  }

  const MAX_IMPORT = parseInt(process.env.MAX_IMPORT_USERS || "200", 10);
  if (users.length === 0) {
    return res.status(400).json({ error: "users array is empty" });
  }
  if (users.length > MAX_IMPORT) {
    return res
      .status(400)
      .json({ error: `Too many users in import (max ${MAX_IMPORT})` });
  }

  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const usernameRe = /^[a-zA-Z0-9_.-]{3,30}$/;

  const results = [];
  for (const u of users) {
    // Basic field presence
    if (!u || !u.username || !u.password || !u.email || !u.department) {
      results.push({
        username: u && u.username,
        error: "Missing required fields",
      });
      continue;
    }

    // Basic validation
    if (!usernameRe.test(u.username)) {
      results.push({ username: u.username, error: "Invalid username format" });
      continue;
    }
    if (!emailRe.test(u.email)) {
      results.push({ username: u.username, error: "Invalid email" });
      continue;
    }
    if (typeof u.password !== "string" || u.password.length < 6) {
      results.push({
        username: u.username,
        error: "Password too short (min 6)",
      });
      continue;
    }
    // Reject probable pre-hashed passwords (bcrypt/argon prefixes)
    if (u.password.startsWith("$2") || u.password.startsWith("$argon")) {
      results.push({
        username: u.username,
        error: "Do not provide pre-hashed passwords",
      });
      continue;
    }

    try {
      const exists = await User.findOne({ username: u.username });
      if (exists) {
        results.push({ username: u.username, error: "Username exists" });
        continue;
      }
      const user = new User({
        username: u.username,
        password: u.password,
        email: u.email,
        role: u.role || "student",
        department: u.department,
      });
      await user.save();
      results.push({ username: u.username, success: true });
    } catch (err) {
      results.push({ username: u.username, error: err.message });
    }
  }
  res.json({ results });
}
