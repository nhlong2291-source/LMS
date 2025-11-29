// Lấy danh sách phần thưởng theo phòng ban, role, trạng thái
export async function getRewardsByDepartment(req, res) {
  try {
    const { departments, status } = req.query;
    const { role, department: userDept } = req.user;
    let filter = {};
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    if (status) {
      filter.status = status;
    }
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    if (role === "student") {
      filter.user = req.user._id;
    }
    const rewards = await Reward.find(filter);
    res.json(rewards);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
import LessonProgress from "../models/LessonProgress.js";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

// Tặng GEM khi hoàn thành toàn bộ khóa học
export async function rewardGemOnCourseComplete(req, res) {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;
    // Lấy tất cả module của khóa học
    const modules = await Module.find({ course: courseId });
    // Lấy tất cả lesson của các module
    const moduleIds = modules.map((m) => m._id);
    const lessons = await Lesson.find({ module: { $in: moduleIds } });
    const lessonIds = lessons.map((l) => l._id);
    // Kiểm tra tiến trình từng lesson
    const progresses = await LessonProgress.find({
      user: userId,
      lesson: { $in: lessonIds },
    });
    const completedLessons = progresses.filter((p) => p.progress >= 100).length;
    if (completedLessons === lessons.length && lessons.length > 0) {
      // Đã hoàn thành toàn bộ bài học
      const user = await User.findById(userId);
      user.gem += 10; // Tặng 10 GEM, có thể chỉnh số lượng
      await user.save();
      return res.json({
        message: "Đã hoàn thành khóa học! Bạn nhận được 10 GEM.",
        gem: user.gem,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Chưa hoàn thành toàn bộ bài học trong khóa học." });
    }
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}
