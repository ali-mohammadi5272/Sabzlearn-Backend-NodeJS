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

const { manager, admin, teacher, teacherHelper, user } = roles;
const managerLevel = [manager];
const adminLevel = [manager, admin];
const teacherLevel = [manager, admin, teacher];
const teacherHelperLevel = [manager, admin, teacher, teacherHelper];

const middleware = (middlwareRole) => {
  return (req, res, next) => {
    const { role: userRole } = req.user;

    // Manager Access Level:
    if (middlwareRole === manager) {
      const isAdmin = isAllowedUser(managerLevel, userRole);
      if (!isAdmin) return forbiddenResponse(res);
      next();
    }

    // Admin Access Level:
    else if (middlwareRole === admin) {
      const isAdmin = isAllowedUser(adminLevel, userRole);
      if (!isAdmin) return forbiddenResponse(res);
      next();
    }

    // Teacher Access Level:
    else if (middlwareRole === teacher) {
      const isAdmin = isAllowedUser(teacherLevel, userRole);
      if (!isAdmin) return forbiddenResponse(res);
      next();
    }

    // Teacher_Helper Access Level:
    else if (middlwareRole === teacherHelper) {
      const isAdmin = isAllowedUser(teacherHelperLevel, userRole);
      if (!isAdmin) return forbiddenResponse(res);
      next();
    }

    // User Access Level
    else {
      return forbiddenResponse(res);
    }
  };
};

module.exports = middleware;
