import express from "express";

import {
  getShopItems,
  buyItem,
  getShopHistory,
  getShopHistoryByDepartment,
} from "../controllers/shopController.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
const router = express.Router();
// Lọc lịch sử giao dịch shop theo phòng ban, role, trạng thái
router.get("/filter", jwtAuth, getShopHistoryByDepartment);

// Lấy danh sách vật phẩm
router.get("/", getShopItems);

// Mua vật phẩm
router.post("/buy", jwtAuth, buyItem);

// Lấy lịch sử giao dịch shop
router.get("/history", jwtAuth, getShopHistory);

export default router;
