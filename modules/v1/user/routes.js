const express = require("express");
const { roles } = require("../../../utils/constants");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const {
  getAll,
  getUser,
  removeUser,
  changeRole,
  freeUser,
  banUser,
  updateUser,
  getUserOrders,
} = require("./controller");

const router = express.Router();

router.use(authMiddleware);
router.put("/", updateUser);
router.route("/orders").get(authMiddleware, getUserOrders);
router.put("/role/:id", accessLevelMiddleware(roles.manager), changeRole);
router.use(accessLevelMiddleware(roles.admin));
router.get("/", getAll);
router.post("/ban/:id", banUser);
router.put("/free/:id", freeUser);
router.route("/:id").get(getUser).delete(removeUser);

module.exports = router;
