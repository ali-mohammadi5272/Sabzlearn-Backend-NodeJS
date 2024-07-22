const express = require("express");
const {
  getAll,
  getUser,
  freeUser,
  banUser,
} = require("../../controllers/v1/userController");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: isAdminMiddleware,
} = require("../../middlewares/isAdminMiddleware");
const router = express.Router();
router.use(authMiddleware, isAdminMiddleware);

router.get("/", getAll);
router.get("/:id", getUser);
router.post("/ban/:id", banUser);
router.put("/free/:id", freeUser);

module.exports.default = router;
