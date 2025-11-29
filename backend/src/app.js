import dotenv from "dotenv";
dotenv.config();
import express from "express";
// ...import các middleware, routes, cấu hình...

const app = express();

// ...cấu hình middleware, routes...
// Ví dụ:
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
// ...import các routes khác...
app.use(express.json());
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/stats", statsRoutes);
// ...các app.use khác...
export default app;
