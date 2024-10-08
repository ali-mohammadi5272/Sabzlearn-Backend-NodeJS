const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { roles } = require("../../../utils/constants");
const {
  addCategroy,
  getAll,
  getCategory,
  removeCategory,
  updateCategory,
} = require("./controller");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getCategory);
router.use(authMiddleware, accessLevelMiddleware(roles.admin));
router.route("/").post(addCategroy);
router.route("/:id").delete(removeCategory).put(updateCategory);

module.exports = router;
