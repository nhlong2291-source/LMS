import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Course from "../src/models/Course.js";
import Module from "../src/models/Module.js";
import Lesson from "../src/models/Lesson.js";
import LessonProgress from "../src/models/LessonProgress.js";
import ShopItem from "../src/models/ShopItem.js";
import ShopHistory from "../src/models/ShopHistory.js";
import UserScore from "../src/models/UserScore.js";

dotenv.config();
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";
jest.setTimeout(30000);

describe("Stats endpoints", () => {
  let adminToken, studentToken, studentId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Clean
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
      LessonProgress.deleteMany({}),
      ShopItem.deleteMany({}),
      ShopHistory.deleteMany({}),
      UserScore.deleteMany({}),
    ]);

    // Create users
    const plain = "123456";
    const student = await User.create({
      username: "s1",
      email: "s1@test.com",
      password: plain,
      role: "student",
      department: "IT",
    });
    const admin = await User.create({
      username: "adm",
      email: "adm@test.com",
      password: plain,
      role: "admin",
      department: "Management",
    });
    studentId = student._id;

    // Create course/module/lesson
    const course = await Course.create({ name: "C1", department: "IT" });
    const module = await Module.create({ name: "M1", course: course._id });
    const lesson = await Lesson.create({
      name: "L1",
      type: "video",
      module: module._id,
      course: course._id,
    });

    // Progress entries
    await LessonProgress.create({
      user: student._id,
      lesson: lesson._id,
      progress: 80,
      lastViewed: new Date(),
    });
    await LessonProgress.create({
      user: student._id,
      lesson: lesson._id,
      progress: 100,
      lastViewed: new Date(),
    });

    // Shop item & history (two entries with dates)
    const item = await ShopItem.create({ name: "Gem Pack", price: 50 });
    const older = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const recent = new Date();
    await ShopHistory.create({
      user: student._id,
      department: "IT",
      item: item._id,
      price: item.price,
      status: "success",
      createdAt: older,
    });
    await ShopHistory.create({
      user: student._id,
      department: "IT",
      item: item._id,
      price: item.price,
      status: "success",
      createdAt: recent,
    });

    // UserScore
    await UserScore.create({ user: student._id, score: 88, department: "IT" });

    // Login helper
    const login = async (route, username, email) => {
      const res = await request(app)
        .post(route)
        .send({ username, email, password: plain });
      return res.body.token || res.body.accessToken;
    };

    studentToken = await login("/users/login", "s1", "s1@test.com");
    adminToken = await login("/admin/login", "adm", "adm@test.com");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Progress stats grouped by course", async () => {
    const res = await request(app)
      .get(`/stats/progress?groupBy=course&department=IT`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // find entry for course
    const found = res.body.find((r) => r.name != null);
    expect(found).toBeDefined();
    expect(found.avgProgress).toBeDefined();
  });

  test("Shop history CSV export with date filter", async () => {
    const from = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days ago
    const res = await request(app)
      .get(`/stats/shop-history?format=csv&from=${from}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/csv/);
    expect(res.text.split("\n")[0]).toContain(
      "userId,username,department,item,price,status,createdAt"
    );
  });

  test("Composite leaderboard respects weights", async () => {
    const res = await request(app)
      .get(
        `/stats/leaderboard?weightScore=1&weightGem=0&weightCompleted=0&departments=IT`
      )
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const top = res.body[0];
    expect(top.user.username).toBe("s1");
  });
});
