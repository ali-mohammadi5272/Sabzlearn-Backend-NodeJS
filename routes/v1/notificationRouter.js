const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  sendNotification,
  getNotificationsByAdmin,
  seeNotification,
} = require("../../controllers/v1/notificationController");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, accessLevelMiddleware(roles.manager), sendNotification);

router
  .route("/admin")
  .get(
    authMiddleware,
    accessLevelMiddleware(roles.teacherHelper),
    getNotificationsByAdmin
  );
router
  .route("/see/:id")
  .put(
    authMiddleware,
    accessLevelMiddleware(roles.teacherHelper),
    seeNotification
  );
module.exports = router;
