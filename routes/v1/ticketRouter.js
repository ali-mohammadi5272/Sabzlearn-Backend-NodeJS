const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { sendTicket } = require("../../controllers/v1/ticketController");

const router = express.Router();

router.route("/").post(authMiddleware, sendTicket);

module.exports = router;
