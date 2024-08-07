const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  discountAllCourses,
  addDiscountCode,
} = require("../../controllers/v1/discountCodeController");

const router = express.Router();

router
  .route("/all")
  .put(
    authMiddleware,
    accessLevelMiddleware(roles.manager),
    discountAllCourses
  );

router
  .route("/")
  .post(authMiddleware, accessLevelMiddleware(roles.admin), addDiscountCode);

module.exports = router;
