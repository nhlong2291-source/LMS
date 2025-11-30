import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Cấu hình nơi lưu file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Lưu vào folder uploads
  },
  filename(req, file, cb) {
    // Đặt tên file: file-ngay-gio.mp4 để tránh trùng
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Validate chỉ cho up video
function checkFileType(file, cb) {
  const filetypes = /mp4|mov|avi|mkv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Chỉ chấp nhận file Video!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Route Upload: POST /api/upload
router.post('/', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('Chưa chọn file');
  // Trả về đường dẫn đầy đủ cho Frontend
  const videoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.send(videoUrl);
});

export default router;
