import request from "supertest";
import app from "../src/app.js";
import logger from "./backend/src/utils/logger.js";

describe("API Main Flows & Role Access", () => {
  let studentToken, managerToken, adminToken;

  beforeAll(async () => {
    // Đăng nhập lấy token cho từng role

    logger.info("Login student...");
    const studentRes = await request(app)
      .post("/user/login")
      .send({ username: "student1", password: "123456" });
    studentToken = studentRes.body.token;
    logger.info({ studentToken }, "Student token");

    logger.info("Login manager...");
    const managerRes = await request(app)
      .post("/user/login")
      .send({ username: "manager1", password: "123456" });
    managerToken = managerRes.body.token;
    logger.info({ managerToken }, "Manager token");

    logger.info("Login admin...");
    const adminRes = await request(app)
      .post("/admin/login")
      .send({ username: "admin1", password: "123456" });
    adminToken = adminRes.body.token;
    logger.info({ adminToken }, "Admin token");
  }, 30000);

  test("Course: student chỉ xem khóa học của mình", async () => {
    const res = await request(app)
      .get("/courses/filter")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    res.body.forEach((c) => {
      expect(c.enrolledUsers).toContain("student1");
    });
  });

  test("Shop: student chỉ xem lịch sử giao dịch của mình", async () => {
    const res = await request(app)
      .get("/shop/filter")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    res.body.forEach((h) => {
      expect(h.user.username).toBe("student1");
    });
  });

  test("Exam: manager chỉ xem bài thi phòng ban mình", async () => {
    const res = await request(app)
      .get("/exams/filter")
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.statusCode).toBe(200);
    res.body.forEach((e) => {
      expect(e.department).toBe("IT"); // giả sử manager1 thuộc IT
    });
  });

  test("Forum: student chỉ xem forum mình tham gia", async () => {
    const res = await request(app)
      .get("/forums/filter")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    res.body.forEach((f) => {
      expect(f.members).toContain("student1");
    });
  });

  test("Notification: student chỉ xem thông báo của mình", async () => {
    const res = await request(app)
      .get("/notifications/filter")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    res.body.forEach((n) => {
      expect(n.user).toBe("student1");
    });
  });

  test("Reward: student chỉ xem phần thưởng của mình", async () => {
    const res = await request(app)
      .get("/rewards/filter")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    res.body.forEach((r) => {
      expect(r.user).toBe("student1");
    });
  });

  test("Leaderboard: manager chỉ xem leaderboard phòng ban mình", async () => {
    const res = await request(app)
      .get("/leaderboard/filter")
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.statusCode).toBe(200);
    res.body.forEach((u) => {
      expect(u.department).toBe("IT");
    });
  }, 20000);
});
