import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  icon: String,
});

export default mongoose.model("ShopItem", shopItemSchema);
