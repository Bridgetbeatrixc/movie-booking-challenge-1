export function authenticate(req, res, next) {
  if (req.user) {
    next();
    return;
  }

  res.status(401).json({
    message: "Authentication is required."
  });
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
