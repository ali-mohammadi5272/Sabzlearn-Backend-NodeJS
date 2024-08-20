const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { addDepartment, getAll, removeDepartment } = require("./controller");
const { roles } = require("../../../utils/constants");

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(getAll)
  .post(accessLevelMiddleware(roles.admin), addDepartment);

router
  .route("/:id")
  .delete(accessLevelMiddleware(roles.admin), removeDepartment);

module.exports = router;
