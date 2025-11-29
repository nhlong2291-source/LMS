import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../src/models/User.js";
import logger from "../src/utils/logger.js";
import Admin from "../src/models/Admin.js";
import bcrypt from "bcryptjs";
import Badge from "../src/models/Badge.js";
import Certificate from "../src/models/Certificate.js";
import Comment from "../src/models/Comment.js";
import Course from "../src/models/Course.js";
import DiscussionPost from "../src/models/DiscussionPost.js";
import Enrollment from "../src/models/Enrollment.js";
import Exam from "../src/models/Exam.js";
import ExamSubmission from "../src/models/ExamSubmission.js";
import Lesson from "../src/models/Lesson.js";
import LessonProgress from "../src/models/LessonProgress.js";
import Module from "../src/models/Module.js";
import News from "../src/models/News.js";
import Notification from "../src/models/Notification.js";
import Post from "../src/models/Post.js";
import Resource from "../src/models/Resource.js";
import ShopHistory from "../src/models/ShopHistory.js";
import ShopItem from "../src/models/ShopItem.js";
import Submission from "../src/models/Submission.js";
import UserScore from "../src/models/UserScore.js";

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  try {
    // Xóa dữ liệu cũ song song
    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Badge.deleteMany({}),
      Certificate.deleteMany({}),
      Comment.deleteMany({}),
      Course.deleteMany({}),
      DiscussionPost.deleteMany({}),
      Enrollment.deleteMany({}),
      Exam.deleteMany({}),
      ExamSubmission.deleteMany({}),
      Lesson.deleteMany({}),
      LessonProgress.deleteMany({}),
      Module.deleteMany({}),
      News.deleteMany({}),
      Notification.deleteMany({}),
      Post.deleteMany({}),
      Resource.deleteMany({}),
      ShopHistory.deleteMany({}),
      ShopItem.deleteMany({}),
      Submission.deleteMany({}),
      UserScore.deleteMany({}),
    ]);

    // Tạo user mẫu
    const users = await User.create([
      {
        username: "student1",
        password: "123456",
        email: "student1@test.com",
        role: "student",
        department: "IT",
      },
      {
        username: "manager1",
        password: "123456",
        email: "manager1@test.com",
        role: "manager",
        department: "IT",
      },
      {
        username: "admin1",
        password: "123456",
        email: "admin1@test.com",
        role: "admin",
        department: "HR",
      },
    ]);
    logger.info({ usersSeeded: users.length }, "Users seeded");

    // Tạo admin mẫu
    await Admin.create({
      username: "admin1",
      password: "123456",
      role: "admin",
    });
    logger.info("Admin seeded");

    // Tạo badge mẫu
    await Badge.create({
      name: "Top Student",
      description: "Awarded for top performance",
      department: "IT",
    });
    logger.info("Badge seeded");

    // Tạo certificate mẫu
    await Certificate.create({
      user: users[0]._id,
      course: null,
      title: "NodeJS Completion",
      department: "IT",
    });
    logger.info("Certificate seeded");

    // Tạo post mẫu
    const post = await Post.create({
      author: users[0]._id,
      title: "Sample Post",
      content: "Excited to learn!",
      department: "IT",
    });
    logger.info("Post seeded");

    // Tạo comment mẫu
    await Comment.create({
      user: users[0]._id,
      comment: "Great course!",
      post: post._id,
      department: "IT",
    });
    logger.info("Comment seeded");

    // Tạo course mẫu
    const courses = await Course.create([
      { name: "NodeJS", description: "Backend course", department: "IT" },
      { name: "ReactJS", description: "Frontend course", department: "IT" },
      { name: "HR Management", description: "HR course", department: "HR" },
    ]);
    logger.info({ coursesSeeded: courses.length }, "Courses seeded");

    // Tạo discussion post mẫu
    await DiscussionPost.create({
      user: users[0]._id,
      content: "How to deploy NodeJS?",
      department: "IT",
    });
    logger.info("DiscussionPost seeded");

    // Tạo enrollment mẫu
    await Enrollment.create({
      user: users[0]._id,
      course: courses[0]._id,
      department: "IT",
    });
    logger.info("Enrollment seeded");

    // Tạo module mẫu
    const module = await Module.create({
      name: "Module 1",
      description: "Basics",
      department: "IT",
      course: courses[0]._id,
    });
    logger.info("Module seeded");

    // Tạo lesson mẫu
    const lessons = await Lesson.create({
      name: "Intro NodeJS",
      type: "video",
      module: module._id,
      content: "Lesson content",
      department: "IT",
      course: courses[0]._id,
    });
    logger.info("Lesson seeded");

    // Tạo lesson progress mẫu
    await LessonProgress.create({
      user: users[0]._id,
      lesson: lessons._id,
      completed: true,
      department: "IT",
    });
    logger.info("LessonProgress seeded");

    // Tạo news mẫu
    await News.create({
      title: "New Course Released",
      content: "Check out NodeJS!",
      author: users[0]._id,
      department: "IT",
    });
    logger.info("News seeded");

    // Tạo notification mẫu
    await Notification.create({
      user: users[0]._id,
      message: "You have a new badge!",
      department: "IT",
    });
    logger.info("Notification seeded");

    // Tạo resource mẫu
    await Resource.create({
      title: "NodeJS Docs",
      url: "https://nodejs.org",
      department: "IT",
    });
    logger.info("Resource seeded");

    // Tạo shop item mẫu
    const shopItem = await ShopItem.create({
      name: "Gem Pack",
      price: 100,
      department: "IT",
    });
    logger.info("ShopItem seeded");

    // Tạo shop history mẫu (gồm item và price)
    await ShopHistory.create([
      {
        user: users[0]._id,
        department: "IT",
        item: shopItem._id,
        price: shopItem.price,
        status: "success",
      },
      {
        user: users[2]._id,
        department: "HR",
        item: shopItem._id,
        price: shopItem.price,
        status: "success",
      },
    ]);
    logger.info("ShopHistory seeded");

    // Tạo exam mẫu
    const exams = await Exam.create([
      {
        title: "NodeJS Final",
        department: "IT",
        questions: [],
        course: courses[0]._id,
      },
      {
        title: "HR Final",
        department: "HR",
        questions: [],
        course: courses[2]._id,
      },
    ]);
    logger.info({ examsSeeded: exams.length }, "Exams seeded");

    // Tạo submission mẫu
    await Submission.create({
      user: users[0]._id,
      exam: exams[0]._id,
      content: "My assignment",
      department: "IT",
    });
    logger.info("Submission seeded");

    // Tạo exam submission mẫu
    await ExamSubmission.create({
      user: users[0]._id,
      exam: exams[0]._id,
      answers: [],
      department: "IT",
    });
    logger.info("ExamSubmission seeded");

    // Tạo user score mẫu
    await UserScore.create({ user: users[0]._id, score: 95, department: "IT" });
    logger.info("UserScore seeded");

    logger.info("Seeding sample data completed!");
  } catch (err) {
    logger.error({ err }, "Seeding error");
  }
  await mongoose.disconnect();
}

seed();
