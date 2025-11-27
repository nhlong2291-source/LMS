import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Nên mã hóa khi lưu thực tế
  role: { type: String, default: "admin" },
});

export default mongoose.model("Admin", adminSchema);
