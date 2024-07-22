const express = require("express");
const { addCategroy } = require("../../controllers/v1/categoryController");

const router = express.Router();

router.route("/").post(addCategroy);

module.exports.default = router;
