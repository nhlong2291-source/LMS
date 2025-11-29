import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import app from "../src/app.js";
import User from "../src/models/User.js";
import logger from "../src/utils/logger.js";

dotenv.config();

// Đảm bảo secret key tồn tại
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";
jest.setTimeout(30000);

describe("API Role Access", () => {
  let studentToken, managerToken, adminToken;

  beforeAll(async () => {
    // 1. Kết nối DB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany({});

    // 2. Password plain (model pre-save will hash)
    const plainPassword = "123456";

    // 3. Tạo User (Seeding Data)
    // Lưu ý: Tạo đầy đủ các trường username, email, department
    const users = [
      {
        role: "student",
        email: "student1@test.com",
        username: "student1",
        dept: "IT",
      },
      {
        role: "manager",
        email: "manager1@test.com",
        username: "manager1",
        dept: "IT",
      },
      {
        role: "admin",
        email: "admin1@test.com",
        username: "admin1",
        dept: "Management",
      },
    ];

    for (const u of users) {
      await User.create({
        username: u.username,
        email: u.email,
        password: plainPassword,
        role: u.role,
        department: u.dept,
      });
    }

    // 4. Hàm login helper
    const loginUser = async (role, email, username) => {
      let route = "/users/login";
      if (role === "admin") route = "/admin/login";

      const res = await request(app).post(route).send({
        email: email,
        username: username,
        password: "123456",
      });

      if (res.status !== 200) {
        logger.error(
          { role, route, status: res.status, body: res.body },
          `Login ${role} failed`
        );
        return null;
      }

      return res.body.token || res.body.accessToken;
    };

    // 5. Thực hiện Login
    logger.info("🔄 Đang login Student...");
    studentToken = await loginUser("student", "student1@test.com", "student1");

    logger.info("🔄 Đang login Manager...");
    managerToken = await loginUser("manager", "manager1@test.com", "manager1");

    logger.info("🔄 Đang login Admin...");
    adminToken = await loginUser("admin", "admin1@test.com", "admin1");
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  // --- TEST CASES ---

  test("Student chỉ xem được dữ liệu bản thân", async () => {
    expect(studentToken).toBeDefined(); // Chặn nếu login lỗi

    const res = await request(app)
      .get("/users/filter") // Route này bắt đầu bằng /users theo app.js
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].role).toBe("student");
  });

  test("Manager chỉ xem được phòng ban mình", async () => {
    expect(managerToken).toBeDefined();

    const res = await request(app)
      .get("/users/filter?departments=IT,HR")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      res.body.forEach((u) => {
        expect(u.department).toBe("IT");
      });
    }
  });

  test("Admin xem được tất cả user", async () => {
    expect(adminToken).toBeDefined();

    const res = await request(app)
      .get("/users/filter")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});
