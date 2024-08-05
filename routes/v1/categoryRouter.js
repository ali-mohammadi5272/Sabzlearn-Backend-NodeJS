const express = require("express");
const {
  addCategroy,
  getAll,
  getCategory,
  removeCategory,
  updateCategory,
} = require("../../controllers/v1/categoryController");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getCategory);
router.use(authMiddleware, accessLevelMiddleware(roles.admin));
router.route("/").post(addCategroy);
router.route("/:id").delete(removeCategory).put(updateCategory);

module.exports.default = router;
