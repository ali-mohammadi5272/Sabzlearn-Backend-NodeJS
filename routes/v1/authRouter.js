const express = require("express");
const { register, login } = require("../../controllers/v1/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
