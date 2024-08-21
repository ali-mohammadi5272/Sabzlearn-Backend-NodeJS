const express = require("express");
const { globalSearch } = require("./controller");

const router = express.Router();

router.route("/").get(globalSearch);

module.exports = router;
