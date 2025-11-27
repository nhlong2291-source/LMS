import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String },
  type: { type: String, enum: ["video", "quiz"], required: true },
  videoUrl: { type: String }, // Nếu là video
  quizCsv: { type: String }, // Nếu là quiz, lưu đường dẫn file hoặc nội dung CSV
  quizQuestions: [
    {
      question: { type: String, required: true },
      answers: [{ type: String, required: true }], // 4 đáp án
      correctAnswer: { type: Number, required: true }, // chỉ số đáp án đúng (0-3)
    },
  ],
  videoProgress: { type: Number, default: 0 }, // % tiến trình xem video
  isRequiredComplete: { type: Boolean, default: false }, // Bắt buộc hoàn thành mới được sang bài tiếp theo
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Lesson", lessonSchema);
