const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const { getUserOrders } = require("./controller");

const router = express.Router();

router.route("/user").get(authMiddleware, getUserOrders);

module.exports = router;
