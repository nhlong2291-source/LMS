import News from "../models/News.js";

// Tạo tin tức
export async function createNews(req, res) {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Lấy tất cả tin tức
export async function getAllNews(req, res) {
  try {
    const newsList = await News.find();
    res.json(newsList);
  } catch (err) {
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
    res.status(400).json({ error: err.message });
  }
}
