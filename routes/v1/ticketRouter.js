const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const { addTicket } = require("../../controllers/v1/ticketController");

const router = express.Router();

router.route("/").post(authMiddleware, addTicket);

module.exports = router;
