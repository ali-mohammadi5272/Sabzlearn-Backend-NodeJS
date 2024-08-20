const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  getAll,
  registerNewsletter,
} = require("../../controllers/v1/newsletterController");

const router = express.Router();

router.route("/register").post(registerNewsletter);

router.use(authMiddleware, accessLevelMiddleware(roles.admin));

router.route("/").get(getAll);

module.exports = router;
