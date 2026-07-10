import jwt from "jsonwebtoken";
import { User } from "./auth.model.js";

export async function authenticate(req, res, next) {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401).json({
      message: "Authentication is required."
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (user) {
      req.user = user;
      next();
      return;
    }

    res.status(401).json({
      message: "User identity not validated."
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired authentication token."
    });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role === "admin") {
    next();
    return;
  }

  res.status(403).json({
    message: "Admin access is required."
  });
}