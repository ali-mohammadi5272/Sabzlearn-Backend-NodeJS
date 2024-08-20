const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  sendMessage,
  answerMessage,
} = require("../../controllers/v1/contactUsController");

const router = express.Router();

router.route("/").post(sendMessage);
router.use(authMiddleware, accessLevelMiddleware(roles.admin));
router.route("/answer/:id").post(answerMessage);

module.exports = router;
