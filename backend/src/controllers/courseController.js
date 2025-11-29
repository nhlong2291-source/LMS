// Lấy danh sách khóa học theo phòng ban, role, trạng thái
export async function getCoursesByDepartment(req, res) {
  try {
    const { departments, status } = req.query; // ?departments=IT,HR&status=active
    const { role, department: userDept } = req.user;
    let filter = {};
    // Lọc theo phòng ban
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    // Lọc theo trạng thái (nếu có trường status)
    if (status) {
      filter.status = status;
    }
    // Nếu là manager/instructor, chỉ cho xem phòng ban mình quản lý
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    // Nếu là admin, xem tất cả
    // Nếu là student, chỉ xem khóa học của mình (giả sử có trường enrolledUsers)
    if (role === "student") {
      filter.enrolledUsers = req.user._id;
    }
    const courses = await Course.find(filter);
    res.json(courses);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
import logger from "../utils/logger.js";
// Tạo module cho course
export async function createModule(req, res) {
  try {
    const { name, description } = req.body;
    const courseId = req.params.courseId;
    const module = new Module({ name, description, course: courseId });
    await module.save();
    res.status(201).json(module);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Lấy modules cho một course (public)
export async function getModulesByCourse(req, res) {
  try {
    const courseId = req.params.courseId;
    const modules = await Module.find({ course: courseId })
      .populate("lessons")
      .lean();
    res.json(modules);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Tạo lesson cho module
export async function createLesson(req, res) {
  try {
    const { name, type, videoUrl, quizCsv, content } = req.body;
    const moduleId = req.params.moduleId;
    const lesson = new Lesson({
      name,
      type,
      videoUrl,
      quizCsv,
      content,
      module: moduleId,
    });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Tạo khóa học (chỉ admin)
export async function createCourse(req, res) {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Lấy tất cả khóa học
export async function getAllCourses(req, res) {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Lấy một khóa học
export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ error: "Course not found" });
    // Fetch modules that belong to this course and populate lessons
    const modules = await Module.find({ course: course._id })
      .populate("lessons")
      .lean();
    res.json({ ...course, modules });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Cập nhật khóa học (chỉ admin)
export async function updateCourse(req, res) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Xóa khóa học (chỉ admin)
export async function deleteCourse(req, res) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Kiểm tra quyền truy cập (ví dụ: chỉ admin mới được tạo/sửa/xóa)
export function checkAdminRole(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden: Admin only" });
}
