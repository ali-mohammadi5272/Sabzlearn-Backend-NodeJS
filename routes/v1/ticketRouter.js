const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const {
  createTicket,
  answerTicketByAdmin,
  answerTicketByUser,
} = require("../../controllers/v1/ticketController");
const { roles } = require("../../utils/constants");

const router = express.Router();

router.route("/").post(authMiddleware, createTicket);
router
  .route("/answerByAdmin/:id")
  .post(
    authMiddleware,
    accessLevelMiddleware(roles.admin),
    answerTicketByAdmin
  );
router.route("/answerByUser/:id").post(authMiddleware, answerTicketByUser);

module.exports = router;
