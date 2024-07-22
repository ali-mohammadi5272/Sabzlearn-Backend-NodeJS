const express = require("express");
const {
  getAll,
  getUser,
  removeUser,
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
router.post("/ban/:id", banUser);
router.put("/free/:id", freeUser);
router.route("/:id").get(getUser).delete(removeUser);

module.exports.default = router;
