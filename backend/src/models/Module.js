import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Module", moduleSchema);
