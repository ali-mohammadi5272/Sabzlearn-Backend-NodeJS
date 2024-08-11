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
} = require("../../controllers/v1/discountCodeController");

const router = express.Router();
router
  .route("/all")
  .put(
    authMiddleware,
    accessLevelMiddleware(roles.manager),
    discountAllCourses
  );

router.use(authMiddleware, accessLevelMiddleware(roles.admin));

router.route("/").get(getAll).post(addDiscountCode);
router.route("/:id").get(getDiscountCode).delete(removeDsicountCode);

module.exports = router;
