const { tokenPayloadData } = require("../utils/auth");
const { default: userModel } = require("../models/user");

const middleware = (req, res, next) => {
  const accessToken = req.header("Authorization")?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized !!" });
  }
  const tokenPayload = tokenPayloadData(accessToken);
  if (!tokenPayload) {
    return res.status(401).json({ message: "Unauthorized !!" });
  }
  const { _id } = tokenPayload;
  const user = userModel.findOne({ _id }).select("-__v -password").lean();
  req.user = Object.assign({}, user);

  next();
};

module.exports.default = middleware;
