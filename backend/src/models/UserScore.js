import mongoose from "mongoose";

const userScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gem: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserScore", userScoreSchema);
