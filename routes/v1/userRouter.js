const express = require("express");
const { freeUser, banUser } = require("../../controllers/v1/userController");

const router = express.Router();

router.post("/ban/:id", banUser);
router.put("/free/:id", freeUser);

module.exports.default = router;
