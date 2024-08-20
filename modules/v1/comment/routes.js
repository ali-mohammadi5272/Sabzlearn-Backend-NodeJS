const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { roles } = require("../../../utils/constants");
const {
  addComment,
  removeComment,
  acceptComment,
  answerComment,
  getAll,
  rejectComment,
} = require("./controller");

const router = express.Router();
router.use(authMiddleware);
router.route("/").post(addComment);
router.use(accessLevelMiddleware(roles.admin));
router.route("/:id").delete(removeComment);
router.route("/accept/:id").put(acceptComment);
router.route("/answer/:id").put(answerComment);
router.route("/reject/:id").put(rejectComment);
router.route("/").get(getAll);

module.exports = router;
