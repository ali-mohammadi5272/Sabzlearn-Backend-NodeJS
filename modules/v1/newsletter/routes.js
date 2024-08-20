const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { roles } = require("../../../utils/constants");
const {
  getAll,
  registerNewsletter,
} = require("./controller");

const router = express.Router();

router.route("/register").post(registerNewsletter);

router.use(authMiddleware, accessLevelMiddleware(roles.admin));

router.route("/").get(getAll);

module.exports = router;
