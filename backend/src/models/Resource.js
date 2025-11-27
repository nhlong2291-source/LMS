import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: String,
  type: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resource", resourceSchema);
