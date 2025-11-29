// Lấy danh sách bài thi theo phòng ban, role, trạng thái
export async function getExamsByDepartment(req, res) {
  try {
    const { departments, status } = req.query; // ?departments=IT,HR&status=active
    const { role, department: userDept } = req.user;
    let filter = {};
    // Lọc theo phòng ban
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    // Lọc theo trạng thái (nếu có trường status)
    if (status) {
      filter.status = status;
    }
    // Nếu là manager/instructor, chỉ cho xem phòng ban mình quản lý
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    // Nếu là admin, xem tất cả
    // Nếu là student, chỉ xem bài thi của khóa học mình tham gia (giả sử có trường enrolledUsers)
    if (role === "student") {
      // Cần bổ sung logic lấy danh sách course của user
      // filter.course = { $in: userCourses };
    }
    const exams = await Exam.find(filter);
    res.json(exams);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
import Exam from "../models/Exam.js";
import Submission from "../models/Submission.js";
import logger from "../utils/logger.js";

// Nộp bài thi
export async function submitExam(req, res) {
  const { userId, examId, answers } = req.body;
  try {
    const submission = new Submission({ user: userId, exam: examId, answers });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Chấm điểm bài thi
export async function gradeExam(req, res) {
  const { submissionId, score } = req.body;
  try {
    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { score, graded: true },
      { new: true }
    );
    if (!submission)
      return res.status(404).json({ error: "Submission not found" });
    res.json(submission);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}
