const express = require("express");
const { roles } = require("../../utils/constants");
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
  default: accessLevelMiddleware,
} = require("../../middlewares/accessLevelMiddleware");
const router = express.Router();

router.use(authMiddleware);
router.put("/", updateUser);
router.put("/:id", accessLevelMiddleware(roles.manager), changeRole);
router.use(accessLevelMiddleware(roles.admin));
router.get("/", getAll);
router.post("/ban/:id", banUser);
router.put("/free/:id", freeUser);
router.route("/:id").get(getUser).delete(removeUser);

module.exports.default = router;
