import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true }, // Phòng ban
  role: {
    type: String,
    enum: ["student", "admin", "teacher", "manager", "instructor"],
    default: "student",
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  gem: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Hàm kiểm tra mật khẩu
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) {
    logger.error("comparePassword: this.password is undefined");
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Kiểm tra xem model "User" đã tồn tại chưa. Nếu có thì dùng lại, chưa có mới tạo mới.
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
