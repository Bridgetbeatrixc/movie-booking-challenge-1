function notImplemented(res, action) {
  res.status(501).json({
    message: `Admin ${action} is not implemented yet.`
  });
}

export function getAdminStats(_req, res) {
  notImplemented(res, "stats");
}

export function listAllBookings(_req, res) {
  notImplemented(res, "booking list");
}
