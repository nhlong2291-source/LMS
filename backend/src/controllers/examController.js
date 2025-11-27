import Exam from "../models/Exam.js";
import Submission from "../models/Submission.js";

// Nộp bài thi
export async function submitExam(req, res) {
  const { userId, examId, answers } = req.body;
  try {
    const submission = new Submission({ user: userId, exam: examId, answers });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
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
    res.status(400).json({ error: err.message });
  }
}
