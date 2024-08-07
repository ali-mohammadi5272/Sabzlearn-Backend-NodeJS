const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  discountAllCourses,
} = require("../../controllers/v1/discountCodeController");

const router = express.Router();

router
  .route("/all")
  .put(
    authMiddleware,
    accessLevelMiddleware(roles.manager),
    discountAllCourses
  );

module.exports = router;
