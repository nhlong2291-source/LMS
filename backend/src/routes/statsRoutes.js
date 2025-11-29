import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import {
  getProgressStats,
  getShopStats,
  getCompositeLeaderboard,
} from "../controllers/statsController.js";

const router = express.Router();

// All stats endpoints require authentication
router.get("/progress", jwtAuth, getProgressStats);
router.get("/shop-history", jwtAuth, getShopStats);
// Leaderboard composite (authenticated)
router.get("/leaderboard", jwtAuth, getCompositeLeaderboard);

export default router;
