const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const {
  addMenu,
  getAll,
  removeMenu,
} = require("../../controllers/v1/menuController");

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(authMiddleware, accessLevelMiddleware(roles.admin), addMenu);

router
  .route("/:id")
  .delete(authMiddleware, accessLevelMiddleware(roles.admin), removeMenu);

module.exports = router;
