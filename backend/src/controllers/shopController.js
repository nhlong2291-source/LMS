// Lấy lịch sử giao dịch shop theo phòng ban, role, trạng thái
export async function getShopHistoryByDepartment(req, res) {
  try {
    const { departments, status } = req.query;
    const { role, department: userDept } = req.user;
    let filter = {};
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    if (status) {
      filter.status = status;
    }
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    if (role === "student") {
      filter.user = req.user._id;
    }
    const history = await ShopHistory.find(filter);
    res.json(history);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
import mongoose from "mongoose";
import logger from "../utils/logger.js";
// Lấy lịch sử giao dịch shop của user
export async function getShopHistory(req, res) {
  try {
    // Giả sử User có trường shopHistory là mảng các giao dịch
    const user = await User.findById(req.user._id).populate("shopHistory.item");
    res.json(user.shopHistory || []);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}
import ShopItem from "../models/ShopItem.js";
import User from "../models/User.js";
import ShopHistory from "../models/ShopHistory.js";

export async function getShopItems(req, res) {
  try {
    const items = await ShopItem.find();
    res.json(items);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
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
    // Record shop history with item and price
    await ShopHistory.create({
      user: user._id,
      department: user.department,
      item: item._id,
      price: item.price,
      status: "success",
    });
    res.json({ message: "Buy success", user });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}
