function notImplemented(res, action) {
  res.status(501).json({
    message: `Authentication ${action} is not implemented yet.`
  });
}

export function register(_req, res) {
  notImplemented(res, "registration");
}

export function login(_req, res) {
  notImplemented(res, "login");
}

export function logout(_req, res) {
  notImplemented(res, "logout");
}

export function getCurrentUser(_req, res) {
  notImplemented(res, "current user lookup");
}
