import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  title: String,
  questions: [Object],
  department: { type: String, required: true }, // Phòng ban
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Exam", examSchema);
