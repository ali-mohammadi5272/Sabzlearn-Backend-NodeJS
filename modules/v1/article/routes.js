const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { uploader } = require("../../../utils/uploader");
const { roles } = require("../../../utils/constants");
const { addArticle, removeArticle } = require("./controller");

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    accessLevelMiddleware(roles.author),
    uploader("public/articles/covers").single("upload"),
    addArticle
  );

router
  .route("/:id")
  .delete(authMiddleware, accessLevelMiddleware(roles.admin), removeArticle);

module.exports = router;
