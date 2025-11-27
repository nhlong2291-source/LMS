// Middleware xử lý lỗi chung
export function notFound(req, res, next) {
  res.status(404).json({ error: "Not Found" });
}

export function errorHandler(err, req, res, next) {
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
}
