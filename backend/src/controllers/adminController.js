import Admin from "../models/Admin.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Lấy danh sách tất cả user
export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Gán khóa học cho user
export async function assignCourseToUser(req, res) {
  const { userId, courseId } = req.body;
  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).json({ error: "User hoặc Course không tồn tại" });
    }
    // Giả sử User có trường courses là mảng
    if (!user.courses) user.courses = [];
    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }
    res.json({ message: "Gán khóa học thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
