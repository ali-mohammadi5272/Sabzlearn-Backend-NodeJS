const { userRegisterInApplicationInfo } = require("../auth");

const middleware = async (req, res, next) => {
  try {
    const user = await userRegisterInApplicationInfo(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized !!" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = middleware;
