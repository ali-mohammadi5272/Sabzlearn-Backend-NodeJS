const express = require("express");
const {
  addCategroy,
  getAll,
  getCategory,
  removeCategory,
} = require("../../controllers/v1/categoryController");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: isAdminMiddleware,
} = require("../../middlewares/isAdminMiddleware");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getCategory);
router.use(authMiddleware, isAdminMiddleware);
router.route("/").post(addCategroy);
router.route("/:id").delete(removeCategory);

module.exports.default = router;
