const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");
const { addMenu } = require("../../controllers/v1/menuController");

const router = express.Router();

module.exports = router;
