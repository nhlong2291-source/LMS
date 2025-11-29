// Lấy tiến trình học theo phòng ban, role, trạng thái
export async function getProgressByDepartment(req, res) {
  try {
    const { departments, status } = req.query;
    const { role, department: userDept, _id: userId } = req.user;
    let filter = {};
    let query = Progress.find();
    if (status) {
      filter.status = status;
    }
    query = query.find(filter).populate({
      path: "user",
      select: "department username email",
    });
    if (departments) {
      const deptArr = departments.split(",");
      query = query.where("user.department").in(deptArr);
    }
    if (role === "manager" || role === "instructor") {
      query = query.where("user.department").equals(userDept);
    }
    if (role === "student") {
      query = query.where("user").equals(userId);
    }
    const progress = await query.exec();
    res.json(progress);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
// Lấy tổng tiến trình học của user
export async function getTotalProgress(req, res) {
  try {
    const progresses = await LessonProgress.find({ user: req.user._id });
    const total = progresses.reduce((acc, cur) => acc + (cur.progress || 0), 0);
    res.json({ totalProgress: total });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Lấy điểm hoàn thành bài học
export async function getLessonCompletion(req, res) {
  try {
    const progress = await LessonProgress.findOne({
      user: req.user._id,
      lesson: req.params.lessonId,
    });
    const completed = progress && progress.progress >= 100;
    res.json({ completed });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}
import LessonProgress from "../models/LessonProgress.js";
import logger from "../utils/logger.js";

export async function getProgress(req, res) {
  try {
    const progress = await LessonProgress.find({ user: req.user._id });
    res.json(progress);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateProgress(req, res) {
  try {
    const { progress } = req.body;
    const updated = await LessonProgress.findOneAndUpdate(
      { user: req.user._id, lesson: req.params.lessonId },
      { progress, lastViewed: new Date() },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}
