import mongoose from "mongoose";
const ShopHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: { type: String },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "ShopItem" },
  price: { type: Number, default: 0 },
  status: { type: String, default: "success" },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("ShopHistory", ShopHistorySchema);
