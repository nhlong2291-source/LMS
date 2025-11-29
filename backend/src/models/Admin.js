import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Nên mã hóa khi lưu thực tế
  role: { type: String, default: "admin" },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

adminSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) {
    logger.error("comparePassword: this.password is undefined");
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Admin", adminSchema);
