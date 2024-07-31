const express = require("express");
const {
  addCourse,
  getCourse,
  getAll,
  registerCourse,
  getCoursesByCategory,
} = require("../../controllers/v1/courseController");
const { uploader } = require("../../utils/uploader");
const { roles } = require("../../utils/constants");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: accessLevelMiddleware,
} = require("../../middlewares/accessLevelMiddleware");

const router = express.Router();

router.route("/").get(getAll);
router.route("/category/:categoryId").get(getCoursesByCategory);
router.route("/:id").get(getCourse);
router.route("/register").post(authMiddleware, registerCourse);
router.use(authMiddleware, accessLevelMiddleware(roles.admin));
router
  .route("/")
  .post(uploader("public/courses/covers").single("upload"), addCourse);

module.exports.default = router;
