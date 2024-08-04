const express = require("express");
const {
  addCourse,
  getCourse,
  getAll,
  registerCourse,
  getCoursesByCategory,
  removeCourse,
  getPopularCourses,
} = require("../../controllers/v1/courseController");
const { uploader } = require("../../utils/uploader");
const { roles } = require("../../utils/constants");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: accessLevelMiddleware,
} = require("../../middlewares/accessLevelMiddleware");

const router = express.Router();

router.route("/").get(getAll);
router.route("/popular").get(getPopularCourses);
router.route("/category/:categoryId").get(getCoursesByCategory);
router.route("/:id").get(getCourse);
router.route("/register").post(authMiddleware, registerCourse);
router.use(authMiddleware, accessLevelMiddleware(roles.admin));
router
  .route("/")
  .post(uploader("public/courses/covers").single("upload"), addCourse);
router.route("/:id").delete(removeCourse);

module.exports.default = router;
