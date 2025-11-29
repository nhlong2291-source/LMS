import User from "../models/User.js";
import logger from "../utils/logger.js";

// Lấy leaderboard theo phòng ban, role, trạng thái
export async function getLeaderboardByDepartment(req, res) {
  try {
    // do not log request headers or tokens
    const { departments, sortBy = "gem", limit = 20 } = req.query;
    let filter = {};
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    // Không lọc theo role, public cho mọi role
    const sortObj = {};
    sortObj[sortBy] = -1;
    const users = await User.find(filter).sort(sortObj).limit(Number(limit));
    res.json(users);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
