const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { getUserOrders } = require("../../controllers/v1/userOrdersController");

const router = express.Router();

router.route("/user").get(authMiddleware, getUserOrders);

module.exports = router;
