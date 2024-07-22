const middleware = (req, res, next) => {
  const isAdmin = req.user.role === "ADMIN" || req.user.role === "MANAGER";
  if (isAdmin) {
    next();
  }
  return res.status(403).json({
    message:
      "You are not allowed to access this page because you are not authenticated or have no permissions to access this page.",
  });
};

module.exports.default = middleware;
