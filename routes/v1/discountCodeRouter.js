const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  discountAllCourses,
  addDiscountCode,
  getAll,
  getDiscountCode,
  removeDsicountCode,
  useDiscountCode,
} = require("../../controllers/v1/discountCodeController");

const router = express.Router();

router.route("/use/:code/:courseId").put(authMiddleware, useDiscountCode);

router.route("/:code/:courseId").get(authMiddleware, getDiscountCode);

router
  .route("/all")
  .put(
    authMiddleware,
    accessLevelMiddleware(roles.manager),
    discountAllCourses
  );

router.use(authMiddleware, accessLevelMiddleware(roles.admin));

router.route("/").get(getAll).post(addDiscountCode);
router.route("/:id").delete(removeDsicountCode);

module.exports = router;
