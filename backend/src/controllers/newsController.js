// Lấy danh sách tin tức theo phòng ban, role, trạng thái
export async function getNewsByDepartment(req, res) {
  try {
    const { departments, status } = req.query;
    const { role, department: userDept } = req.user;
    let filter = {};
    if (departments) {
      const deptArr = departments.split(",");
      filter.department = { $in: deptArr };
    }
    if (status) {
      filter.status = status;
    }
    if (role === "manager" || role === "instructor") {
      filter.department = userDept;
    }
    const news = await News.find(filter);
    res.json(news);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
import News from "../models/News.js";
import logger from "../utils/logger.js";

// Tạo tin tức
export async function createNews(req, res) {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Lấy tất cả tin tức
export async function getAllNews(req, res) {
  try {
    const newsList = await News.find();
    res.json(newsList);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Cập nhật tin tức
export async function updateNews(req, res) {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Xóa tin tức
export async function deleteNews(req, res) {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json({ message: "News deleted" });
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Xuất bản tin tức
export async function publishNews(req, res) {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { published: true },
      { new: true }
    );
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    const log = req?.logger ?? logger;
    log.error(err);
    res.status(400).json({ error: err.message });
  }
}
