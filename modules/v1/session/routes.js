const express = require("express");
const { uploader } = require("../../../utils/uploader");
const { roles } = require("../../../utils/constants");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const {
  getAll,
  addSession,
  getSession,
  getSessionAndAllCourseSessions,
  removeSession,
} = require("./controller");

const router = express.Router();

router.route("/:courseId/:sessionId").get(getSessionAndAllCourseSessions);
router.route("/:id").get(getSession);

router.use(authMiddleware, accessLevelMiddleware(roles.teacher));
router
  .route("/")
  .get(getAll)
  .post(uploader("public/courses/sessions").single("upload"), addSession);
router.route("/:id").delete(removeSession);

module.exports = router;
