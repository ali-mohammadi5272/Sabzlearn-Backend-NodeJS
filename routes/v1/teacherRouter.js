const express = require("express");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: isAdminMiddleware,
} = require("../../middlewares/isAdminMiddleware");
const { addTeacher } = require("../../controllers/v1/teacherController");

const router = express.Router();

router.use(authMiddleware, isAdminMiddleware);

router.route("/").post(addTeacher);

module.exports.default = router;
