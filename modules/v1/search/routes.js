const express = require("express");
const { globalSearch } = require("../../controllers/v1/searchController");

const router = express.Router();

router.route("/").get(globalSearch);

module.exports = router;
