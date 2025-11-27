import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

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
    res.status(400).json({ error: err.message });
  }
}
