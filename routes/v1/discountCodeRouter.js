const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  discountAllCourses,
  addDiscountCode,
  getAll,
  getDiscountCode,
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
  .get(authMiddleware, accessLevelMiddleware(roles.admin), getAll)
  .post(authMiddleware, accessLevelMiddleware(roles.admin), addDiscountCode);

router
  .route("/:id")
  .get(authMiddleware, accessLevelMiddleware(roles.admin), getDiscountCode);

module.exports = router;
