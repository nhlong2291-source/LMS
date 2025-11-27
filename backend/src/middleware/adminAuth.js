export default function adminAuth(req, res, next) {
  // Simple example: check for admin token in headers
  const adminToken = req.headers["x-admin-token"];
  if (adminToken === process.env.ADMIN_TOKEN) {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Forbidden: Admin authentication required" });
}
