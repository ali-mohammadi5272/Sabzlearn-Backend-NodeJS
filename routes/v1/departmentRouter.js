const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const {
  addDepartment,
  getAll,
  removeDepartment,
} = require("../../controllers/v1/departmentController");
const { roles } = require("../../utils/constants");

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
