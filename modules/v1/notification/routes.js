const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { roles } = require("../../../utils/constants");
const {
  sendNotification,
  getNotificationsByAdmin,
  seeNotification,
  removeNotification,
  getAdminNotificationsByManager,
} = require("./controller");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, accessLevelMiddleware(roles.manager), sendNotification);

router
  .route("/:id")
  .delete(
    authMiddleware,
    accessLevelMiddleware(roles.manager),
    removeNotification
  );

router
  .route("/:adminId")
  .get(
    authMiddleware,
    accessLevelMiddleware(roles.manager),
    getAdminNotificationsByManager
  );

router
  .route("/admin")
  .get(
    authMiddleware,
    accessLevelMiddleware(roles.teacherHelper),
    getNotificationsByAdmin
  );
router
  .route("/admin/see/:id")
  .put(
    authMiddleware,
    accessLevelMiddleware(roles.teacherHelper),
    seeNotification
  );
module.exports = router;
