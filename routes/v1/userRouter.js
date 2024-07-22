const express = require("express");
const {
  getAll,
  getUser,
  removeUser,
  changeRole,
  freeUser,
  banUser,
  updateUser,
} = require("../../controllers/v1/userController");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: isAdminMiddleware,
} = require("../../middlewares/isAdminMiddleware");
const router = express.Router();

router.use(authMiddleware);
router.put("/", updateUser);
router.use(isAdminMiddleware);
router.get("/", getAll);
router.post("/ban/:id", banUser);
router.put("/free/:id", freeUser);
router.route("/:id").get(getUser).delete(removeUser).put(changeRole);

module.exports.default = router;
