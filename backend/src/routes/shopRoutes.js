import express from "express";

import {
  getShopItems,
  buyItem,
  getShopHistory,
} from "../controllers/shopController.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
const router = express.Router();

// Lấy danh sách vật phẩm
router.get("/", getShopItems);

// Mua vật phẩm
router.post("/buy", jwtAuth, buyItem);

// Lấy lịch sử giao dịch shop
router.get("/history", jwtAuth, getShopHistory);

export default router;
