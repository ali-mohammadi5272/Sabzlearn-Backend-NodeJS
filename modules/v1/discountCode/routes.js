const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { roles } = require("../../../utils/constants");
const {
  discountAllCourses,
  addDiscountCode,
  getAll,
  getDiscountCode,
  removeDsicountCode,
  useDiscountCode,
} = require("./controller");

const router = express.Router();

router.route("/use").put(authMiddleware, useDiscountCode);

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
