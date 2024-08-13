const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const {
  addDepartment,
  getAll,
} = require("../../controllers/v1/departmentController");
const { roles } = require("../../utils/constants");

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(getAll)
  .post(accessLevelMiddleware(roles.admin), addDepartment);

module.exports = router;
