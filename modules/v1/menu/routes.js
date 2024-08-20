const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { roles } = require("../../../utils/constants");
const { addMenu, getAll, removeMenu, updateMenu } = require("./controller");

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(authMiddleware, accessLevelMiddleware(roles.admin), addMenu);

router
  .route("/:id")
  .put(authMiddleware, accessLevelMiddleware(roles.admin), updateMenu)
  .delete(authMiddleware, accessLevelMiddleware(roles.admin), removeMenu);

module.exports = router;
