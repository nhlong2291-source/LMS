import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

// Ensure uploads directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed MIME types and extensions (whitelist)
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR + path.sep);
  },
  filename: (req, file, cb) => {
    // Use a cryptographically strong random filename and preserve extension
    const ext = path.extname(file.originalname) || "";
    const name = crypto.randomBytes(16).toString("hex") + ext.toLowerCase();
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  // Reject files without a mimetype or with disallowed mimetype
  if (!file.mimetype || !ALLOWED_MIME.has(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
}

const MAX_FILE_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE || "5242880", 10); // default 5MB

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export default upload;
