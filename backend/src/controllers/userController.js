import User from "../models/User.js";
import logger from "../utils/logger.js";

// Lấy danh sách user theo phòng ban, role, trạng thái
export async function getUsersByDepartment(req, res) {
  try {
    const { departments, roles, status } = req.query; // ?departments=IT,HR&roles=student,manager&status=active
    const { role, department: userDept } = req.user; // lấy từ JWT
    let filter = {};
    // Lọc theo phòng ban
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    // Lọc theo role
    if (roles) {
      const roleArr = roles.split(",");
      filter.role = { $in: roleArr };
    }
    // Lọc theo trạng thái
    if (status) {
      filter.status = status;
    }
    // Nếu là manager/instructor, chỉ cho xem phòng ban mình quản lý
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    // Nếu là admin, xem tất cả
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

// ...các hàm controller khác (CRUD, update, delete, v.v.)
