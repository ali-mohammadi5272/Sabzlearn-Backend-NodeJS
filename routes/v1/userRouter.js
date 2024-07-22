const express = require("express");
const {
  getAll,
  freeUser,
  banUser,
} = require("../../controllers/v1/userController");

const router = express.Router();

router.get("/", getAll);
router.post("/ban/:id", banUser);
router.put("/free/:id", freeUser);

module.exports.default = router;
