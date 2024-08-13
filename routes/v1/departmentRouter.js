const express = require("express");
const { addDepartment } = require("../../controllers/v1/departmentController");

const router = express.Router();

router.route("/").post(addDepartment);

module.exports = router;
