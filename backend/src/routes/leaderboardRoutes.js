import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { getLeaderboardByDepartment } from "../controllers/leaderboardController.js";

const router = express.Router();

//
router.get("/filter", getLeaderboardByDepartment);

export default router;
