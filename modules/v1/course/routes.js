const express = require("express");
const { uploader } = require("../../utils/uploader");
const { roles } = require("../../utils/constants");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const {
  addCourse,
  getCourse,
  getAll,
  registerCourse,
  getCoursesByCategory,
  removeCourse,
  getPopularCourses,
} = require("../../controllers/v1/courseController");

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

module.exports = router;
