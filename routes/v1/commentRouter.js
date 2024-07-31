const express = require("express");
const { addComment } = require("../../controllers/v1/commentController");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.route("/").post(addComment);

module.exports.default = router;
