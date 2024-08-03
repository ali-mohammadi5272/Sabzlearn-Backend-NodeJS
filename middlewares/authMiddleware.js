const { isUserRegisterInApplication } = require("../utils/auth");

const middleware = async (req, res, next) => {
  try {
    const user = await isUserRegisterInApplication(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized !!" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.default = middleware;
