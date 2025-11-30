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

// Đăng ký khóa học (sử dụng user từ req.user để bảo mật)
export async function enrollCourse(req, res) {
  const { courseId } = req.body;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    // Nếu đã có đăng ký thì trả về lỗi
    const exists = await Enrollment.findOne({ user: userId, course: courseId });
    if (exists) return res.status(400).json({ error: "Bạn đã gửi yêu cầu rồi" });

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
    const enrollment = await Enrollment.findByIdAndUpdate(enrollmentId, { status: "approved" }, { new: true });
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Kiểm tra trạng thái đăng ký của người dùng cho một khóa học
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });

    if (enrollment) {
      res.json({
        isEnrolled: true,
        status: enrollment.status, // 'pending', 'approved', 'rejected'
        progress: enrollment.progress || 0,
      });
    } else {
      res.json({ isEnrolled: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi kiểm tra đăng ký", error: error.message });
  }
};
