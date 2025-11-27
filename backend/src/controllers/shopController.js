import mongoose from "mongoose";
// Lấy lịch sử giao dịch shop của user
export async function getShopHistory(req, res) {
  try {
    // Giả sử User có trường shopHistory là mảng các giao dịch
    const user = await User.findById(req.user._id).populate("shopHistory.item");
    res.json(user.shopHistory || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
import ShopItem from "../models/ShopItem.js";
import User from "../models/User.js";

export async function getShopItems(req, res) {
  try {
    const items = await ShopItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function buyItem(req, res) {
  const { itemId } = req.body;
  try {
    const item = await ShopItem.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });
    // Giả sử user có trường gem
    const user = await User.findById(req.user._id);
    if (user.gem < item.price)
      return res.status(400).json({ error: "Not enough gem" });
    user.gem -= item.price;
    await user.save();
    res.json({ message: "Buy success", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
