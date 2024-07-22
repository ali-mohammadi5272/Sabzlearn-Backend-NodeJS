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

router.get("/", getAll);
router.get("/:id", getUser);
router.post("/ban/:id", authMiddleware, isAdminMiddleware, banUser);
router.put("/free/:id", authMiddleware, isAdminMiddleware, freeUser);

module.exports.default = router;
