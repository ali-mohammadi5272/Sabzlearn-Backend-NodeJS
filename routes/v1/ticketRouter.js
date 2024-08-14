const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { createTicket } = require("../../controllers/v1/ticketController");
const { roles } = require("../../utils/constants");

const router = express.Router();

router.route("/").post(authMiddleware, createTicket);

module.exports = router;
