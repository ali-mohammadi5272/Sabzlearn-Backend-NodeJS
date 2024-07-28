const express = require("express");
const {
  getAll,
  addSession,
} = require("../../controllers/v1/sessionController");
const { uploader } = require("../../utils/uploader");
const { roles } = require("../../utils/constants");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: accessLevelMiddleware,
} = require("../../middlewares/accessLevelMiddleware");

const router = express.Router();

router.use(authMiddleware, accessLevelMiddleware(roles.teacher));
router
  .route("/")
  .get(getAll)
  .post(uploader("public/courses/sessions").single("upload"), addSession);

module.exports.default = router;
