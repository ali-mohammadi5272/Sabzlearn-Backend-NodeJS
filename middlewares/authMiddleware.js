const { tokenPayloadData } = require("../utils/auth");
const { default: userModel } = require("../models/user");

const middleware = async (req, res, next) => {
  const accessToken = req.header("Authorization")?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized !!" });
  }
  const tokenPayload = tokenPayloadData(accessToken);
  if (!tokenPayload) {
    return res.status(401).json({ message: "Unauthorized !!" });
  }
  const { _id } = tokenPayload;
  try {
    const user = await userModel
      .findOne({ _id })
      .select("-__v -password")
      .lean();
    req.user = Object.assign({}, user);
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.default = middleware;
