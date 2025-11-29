// Middleware xác thực JWT
import jwt from "jsonwebtoken";

export function jwtAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    // Do not log secrets or tokens in production logs
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    // avoid leaking error details
    res.status(401).json({ error: "Invalid Token" });
  }
}

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
