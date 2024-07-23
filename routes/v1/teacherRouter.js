const express = require("express");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: isAdminMiddleware,
} = require("../../middlewares/isAdminMiddleware");
const {
  addTeacher,
  removeTeacher,
} = require("../../controllers/v1/teacherController");

const router = express.Router();

router.use(authMiddleware, isAdminMiddleware);

router.route("/").post(addTeacher);
router.route("/:id").delete(removeTeacher);

module.exports.default = router;
