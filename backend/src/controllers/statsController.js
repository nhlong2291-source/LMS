import LessonProgress from "../models/LessonProgress.js";
import ShopHistory from "../models/ShopHistory.js";
import User from "../models/User.js";
import UserScore from "../models/UserScore.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

// Stats controller: progress, shop-history and composite leaderboard
export async function getProgressStats(req, res) {
  try {
    const { userId, department, groupBy = "user" } = req.query;
    const requester = req.user || {};

    // students may only request their own stats
    if (
      requester.role === "student" &&
      userId &&
      userId !== String(requester._id)
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const match = {};
    if (userId) match.user = mongoose.Types.ObjectId(userId);
    // only apply department filter directly on LessonProgress when grouping by user
    if (department && groupBy === "user") match.department = department;

    if (groupBy === "user") {
      const stats = await LessonProgress.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$user",
            avgProgress: { $avg: { $ifNull: ["$progress", 0] } },
            lessonsCompleted: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $gte: ["$progress", 100] },
                      { $eq: ["$completed", true] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            totalLessons: { $sum: 1 },
            lastViewed: { $max: "$lastViewed" },
          },
        },
      ]);

      if (userId) {
        const s = stats[0] || {
          avgProgress: 0,
          lessonsCompleted: 0,
          totalLessons: 0,
        };
        return res.json({
          user: userId,
          avgProgress: s.avgProgress,
          lessonsCompleted: s.lessonsCompleted,
          totalLessons: s.totalLessons,
          lastViewed: s.lastViewed,
        });
      }

      const results = await Promise.all(
        stats.map(async (s) => {
          const user = await User.findById(s._id).select(
            "username department email"
          );
          return {
            user: user || { _id: s._id },
            avgProgress: s.avgProgress,
            lessonsCompleted: s.lessonsCompleted,
            totalLessons: s.totalLessons,
            lastViewed: s.lastViewed,
          };
        })
      );
      return res.json(results);
    }

    if (groupBy === "module" || groupBy === "course") {
      // When grouping by course we need to resolve through module -> course
      const pipeline = [
        { $match: match },
        {
          $lookup: {
            from: "lessons",
            localField: "lesson",
            foreignField: "_id",
            as: "lessonDoc",
          },
        },
        { $unwind: { path: "$lessonDoc", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "modules",
            localField: "lessonDoc.module",
            foreignField: "_id",
            as: "moduleDoc",
          },
        },
        { $unwind: { path: "$moduleDoc", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id:
              groupBy === "module" ? "$lessonDoc.module" : "$moduleDoc.course",
            avgProgress: { $avg: { $ifNull: ["$progress", 0] } },
            lessonsCompleted: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $gte: ["$progress", 100] },
                      { $eq: ["$completed", true] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            totalLessons: { $sum: 1 },
            lastViewed: { $max: "$lastViewed" },
          },
        },
      ];
      const stats = await LessonProgress.aggregate(pipeline);

      const Model =
        groupBy === "module"
          ? (await import("../models/Module.js")).default
          : (await import("../models/Course.js")).default;
      const results = await Promise.all(
        stats.map(async (s) => {
          const doc = s._id
            ? await Model.findById(s._id).select("name department")
            : null;
          return {
            id: s._id,
            name: doc ? doc.name : null,
            department: doc ? doc.department : null,
            avgProgress: s.avgProgress,
            lessonsCompleted: s.lessonsCompleted,
            totalLessons: s.totalLessons,
            lastViewed: s.lastViewed,
          };
        })
      );

      // If department filter provided, filter results by the resolved document's department
      const filtered = department
        ? results.filter((r) => r && r.department === department)
        : results;
      return res.json(filtered);
    }

    return res.status(400).json({ error: "Invalid groupBy" });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Shop stats: pagination, totals, date filter, CSV export
export async function getShopStats(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      department,
      from,
      to,
      export: exportFormat,
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    const { role, department: userDept, _id: userId } = req.user || {};
    if (role === "student") filter.user = mongoose.Types.ObjectId(userId);
    if (role === "manager" || role === "instructor")
      filter.department = userDept;
    if (department) filter.department = department;
    if (from || to) filter.createdAt = {};
    if (from) {
      const fromD = new Date(from);
      if (!isNaN(fromD)) filter.createdAt.$gte = fromD;
    }
    if (to) {
      const toD = new Date(to);
      if (!isNaN(toD)) filter.createdAt.$lte = toD;
    }

    // Populate item and user
    const itemsQuery = ShopHistory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("item")
      .populate("user", "username department")
      .lean();
    const totalsAgg = ShopHistory.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalSpent: { $sum: "$price" },
        },
      },
    ]);

    const [items, totals] = await Promise.all([
      itemsQuery.exec(),
      totalsAgg.exec(),
    ]);
    const totalsByStatus = {};
    totals.forEach(
      (t) =>
        (totalsByStatus[t._id] = { count: t.count, totalSpent: t.totalSpent })
    );

    // CSV export
    if (exportFormat === "csv" || req.query.format === "csv") {
      const header = [
        "userId",
        "username",
        "department",
        "item",
        "price",
        "status",
        "createdAt",
      ];
      const rows = items.map((it) => [
        it.user ? String(it.user._id) : "",
        it.user ? it.user.username || "" : "",
        it.department || "",
        it.item ? it.item.name || "" : "",
        it.price || 0,
        it.status || "",
        it.createdAt ? new Date(it.createdAt).toISOString() : "",
      ]);
      const csv = [header.join(",")]
        .concat(
          rows.map((r) => r.map((c) => String(c).replace(/"/g, '""')).join(","))
        )
        .join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="shop_history.csv"`
      );
      return res.send(csv);
    }

    res.json({
      items,
      totalsByStatus,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Composite leaderboard: combine UserScore, gem and completions
export async function getCompositeLeaderboard(req, res) {
  try {
    const {
      departments,
      limit = 20,
      sortBy = "composite",
      weightScore = 0.6,
      weightGem = 0.2,
      weightCompleted = 0.2,
    } = req.query;
    const match = {};
    if (departments) match.department = { $in: departments.split(",") };

    const scores = await UserScore.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$user",
          score: { $max: "$score" },
          department: { $first: "$department" },
        },
      },
    ]);
    const scoreMap = new Map(
      scores.map((s) => [
        String(s._id),
        { score: s.score || 0, department: s.department },
      ])
    );

    // (debug logs removed)

    const userFilter = {};
    if (departments) userFilter.department = { $in: departments.split(",") };
    const users = await User.find(userFilter)
      .select("username gem department")
      .lean();

    // (debug logs removed)

    const userIds = users.map((u) => new mongoose.Types.ObjectId(u._id));
    const completions = await LessonProgress.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: "$user",
          completed: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $gte: ["$progress", 100] },
                    { $eq: ["$completed", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);
    // (debug logs removed)
    const compMap = new Map(
      completions.map((c) => [String(c._id), c.completed || 0])
    );

    const wScore = Number(weightScore);
    const wGem = Number(weightGem);
    const wCompleted = Number(weightCompleted);

    const list = users.map((u) => {
      const id = String(u._id);
      const score = scoreMap.get(id)?.score || 0;
      const completed = compMap.get(id) || 0;
      const gem = u.gem || 0;
      const composite = score * wScore + gem * wGem + completed * wCompleted;
      return {
        user: u,
        score,
        gem,
        completed,
        composite,
        department: u.department,
      };
    });

    const sorted = list
      .sort((a, b) => b[sortBy] - a[sortBy])
      .slice(0, Number(limit));
    res.json(sorted);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default {};
