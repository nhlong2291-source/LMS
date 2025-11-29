import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  department: { type: String, required: true }, // Phòng ban
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Course", courseSchema);
