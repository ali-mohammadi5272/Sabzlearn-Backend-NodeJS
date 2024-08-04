const express = require("express");
const {
  addComment,
  removeComment,
  acceptComment,
  answerComment,
} = require("../../controllers/v1/commentController");
const { default: authMiddleware } = require("../../middlewares/authMiddleware");
const {
  default: accessLevelMiddleware,
} = require("../../middlewares/accessLevelMiddleware");
const { roles } = require("../../utils/constants");

const router = express.Router();

router.use(authMiddleware);
router.route("/").post(addComment);
router.use(accessLevelMiddleware(roles.admin));
router.route("/:id").delete(removeComment);
router.route("/accept/:id").put(acceptComment);
router.route("/answer/:id").put(answerComment);

module.exports.default = router;
