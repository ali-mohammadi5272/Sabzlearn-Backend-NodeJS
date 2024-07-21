const express = require("express");
const { register, login } = require("../../controllers/v1/authController");
const { banUser, freeUser } = require("../../controllers/v1/banUserController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/banUser", banUser);
router.delete("/freeUser/:id", freeUser);

module.exports.default = router;
