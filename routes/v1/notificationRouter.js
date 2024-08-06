const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  sendNotification,
} = require("../../controllers/v1/notificationController");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, accessLevelMiddleware(roles.manager), sendNotification);

module.exports = router;
