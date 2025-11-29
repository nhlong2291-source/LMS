// Lấy danh sách đăng ký theo phòng ban, role, trạng thái
export async function getEnrollmentsByDepartment(req, res) {
  try {
    const { departments, status } = req.query; // ?departments=IT,HR&status=approved
    const { role, department: userDept, _id: userId } = req.user;
    let filter = {};
    // Populate user và course để lấy thông tin phòng ban
    let query = Enrollment.find();
    if (status) {
      filter.status = status;
    }
    query = query
      .find(filter)
      .populate({
        path: "user",
        select: "department username email",
      })
      .populate({
        path: "course",
        select: "department name",
      });
    // Lọc theo phòng ban
    if (departments) {
      const deptArr = departments.split(",");
      query = query.where("user.department").in(deptArr);
    }
    // Nếu là manager/instructor, chỉ cho xem phòng ban mình quản lý
    if (role === "manager" || role === "instructor") {
      query = query.where("user.department").equals(userDept);
    }
    // Nếu là student, chỉ xem đăng ký của mình
    if (role === "student") {
      query = query.where("user").equals(userId);
    }
    const enrollments = await query.exec();
    res.json(enrollments);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

// Đăng ký khóa học
export async function enrollCourse(req, res) {
  const { userId, courseId } = req.body;
  try {
    // Tạo bản ghi đăng ký
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      status: "pending",
    });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Duyệt đăng ký (admin)
export async function approveEnrollment(req, res) {
  const { enrollmentId } = req.body;
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { status: "approved" },
      { new: true }
    );
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}
