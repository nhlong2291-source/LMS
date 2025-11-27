import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  progress: Number,
  lastViewed: Date,
});

export default mongoose.model("LessonProgress", lessonProgressSchema);
