const { roles } = require("../utils/constants");

const forbiddenResponse = (res) => {
  return res.status(403).json({
    message:
      "You are not allowed to access this page because you are not authenticated or have no permissions to access this page.",
  });
};

const isAllowedUser = (validRoles, userRole) => {
  return validRoles.some((role) => role === userRole);
};

const managerLevel = [roles.manager];
const teacherLevel = [roles.manager, roles.teacher];
const adminLevel = [roles.manager, roles.teacher, roles.admin];

const middleware = (middlwareRole) => {
  return (req, res, next) => {
    const { role: userRole } = req.user;

    // Manager Access Level:
    if (middlwareRole === roles.manager) {
      const isAdmin = isAllowedUser(managerLevel, userRole);
      if (!isAdmin) return forbiddenResponse(res);
      next();
    }

    // Teacher Access Level:
    else if (middlwareRole === roles.teacher) {
      const isAdmin = isAllowedUser(teacherLevel, userRole);
      if (!isAdmin) return forbiddenResponse(res);
      next();
    }

    // Admin Access Level:
    else if (middlwareRole === roles.admin) {
      const isAdmin = isAllowedUser(adminLevel, userRole);
      if (!isAdmin) return forbiddenResponse(res);
      next();
    }

    // User Access Level
    else {
      return forbiddenResponse(res);
    }
  };
};

module.exports = {
  default: middleware,
};
