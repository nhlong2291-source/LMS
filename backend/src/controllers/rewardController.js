import LessonProgress from "../models/LessonProgress.js";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";

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
    res.status(500).json({ error: err.message });
  }
}
