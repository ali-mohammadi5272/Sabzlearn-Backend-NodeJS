const { roles } = require("../utils/constants");
const middleware = (req, res, next) => {
  const isAdmin =
    req.user.role === roles.admin || req.user.role === roles.manager;
  if (!isAdmin) {
    return res.status(403).json({
      message:
        "You are not allowed to access this page because you are not authenticated or have no permissions to access this page.",
    });
  }
  next();
};

module.exports.default = middleware;
