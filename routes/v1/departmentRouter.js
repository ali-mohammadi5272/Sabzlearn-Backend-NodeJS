const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const {
  addDepartment,
  getAll,
} = require("../../controllers/v1/departmentController");

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(getAll).post(addDepartment);

module.exports = router;
