const express = require("express");
const { addCourse } = require("../../controllers/v1/courseController");
const { uploader } = require("../../utils/uploader");
const { roles } = require("../../utils/constants");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: accessLevelMiddleware,
} = require("../../middlewares/accessLevelMiddleware");

const router = express.Router();

router.use(authMiddleware, accessLevelMiddleware(roles.admin));
router.route("/").post(uploader.single("upload"), addCourse);

module.exports.default = router;
