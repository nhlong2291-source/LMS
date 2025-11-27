// Lấy tổng tiến trình học của user
export async function getTotalProgress(req, res) {
  try {
    const progresses = await LessonProgress.find({ user: req.user._id });
    const total = progresses.reduce((acc, cur) => acc + (cur.progress || 0), 0);
    res.json({ totalProgress: total });
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
}
import LessonProgress from "../models/LessonProgress.js";

export async function getProgress(req, res) {
  try {
    const progress = await LessonProgress.find({ user: req.user._id });
    res.json(progress);
  } catch (err) {
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
    res.status(400).json({ error: err.message });
  }
}
