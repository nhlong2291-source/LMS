// Middleware phân quyền
export function protect(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

export function admin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ error: "Admin only" });
}

export function instructor(req, res, next) {
  if (req.user && req.user.role === "instructor") return next();
  return res.status(403).json({ error: "Instructor only" });
}

export function manager(req, res, next) {
  if (req.user && req.user.role === "manager") return next();
  return res.status(403).json({ error: "Manager only" });
}
