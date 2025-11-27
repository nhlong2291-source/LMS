import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
// Tạo module cho course
export async function createModule(req, res) {
  try {
    const { name, description } = req.body;
    const courseId = req.params.courseId;
    const module = new Module({ name, description, course: courseId });
    await module.save();
    res.status(201).json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    res.status(400).json({ error: err.message });
  }
}

// Lấy tất cả khóa học
export async function getAllCourses(req, res) {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Lấy một khóa học
export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
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
