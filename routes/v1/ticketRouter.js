const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const accessLevelMiddleware = require("../../middlewares/accessLevelMiddleware");
const {
  createTicket,
  answerTicketByAdmin,
  answerTicketByUser,
  getAllTicketsByUser,
  getTicket,
  getAllUnAnsweredTickets,
} = require("../../controllers/v1/ticketController");
const { roles } = require("../../utils/constants");

const router = express.Router();

router.route("/").post(authMiddleware, createTicket);
router
  .route("/unAnswered")
  .get(
    authMiddleware,
    accessLevelMiddleware(roles.admin),
    getAllUnAnsweredTickets
  );
router.route("/:id").get(authMiddleware, getTicket);
router
  .route("/answerByAdmin/:id")
  .post(
    authMiddleware,
    accessLevelMiddleware(roles.admin),
    answerTicketByAdmin
  );
router.route("/answerByUser/:id").post(authMiddleware, answerTicketByUser);
router.route("/user").get(authMiddleware, getAllTicketsByUser);

module.exports = router;
