const express = require("express");
const {
  addComment,
  removeComment,
  acceptComment,
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

module.exports.default = router;
