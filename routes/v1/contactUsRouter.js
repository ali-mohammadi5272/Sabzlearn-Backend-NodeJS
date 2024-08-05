const express = require("express");
const { sendMessage } = require("../../controllers/v1/contactUsController");

const router = express.Router();

router.route("/").post(sendMessage);

module.exports = router;
