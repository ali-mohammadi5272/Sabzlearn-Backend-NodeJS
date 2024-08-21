const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { roles } = require("../../../utils/constants");
const { sendMessage, answerMessage, getAllByManager } = require("./controller");

const router = express.Router();

router.route("/").post(sendMessage);
router.use(authMiddleware, accessLevelMiddleware(roles.admin));
router.route("/answer/:id").post(answerMessage);
router.route("/all").get(getAllByManager);

module.exports = router;
