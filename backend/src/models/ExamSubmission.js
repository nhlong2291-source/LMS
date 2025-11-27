import mongoose from "mongoose";

const examSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  answers: [Object],
  score: Number,
  graded: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("ExamSubmission", examSubmissionSchema);
