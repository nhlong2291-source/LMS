import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { getRewardsByDepartment } from "../controllers/rewardController.js";

const router = express.Router();

router.get("/filter", jwtAuth, getRewardsByDepartment);

export default router;
