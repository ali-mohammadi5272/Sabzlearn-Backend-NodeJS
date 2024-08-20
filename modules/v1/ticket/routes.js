const express = require("express");
const authMiddleware = require("../../../utils/middlewares/authMiddleware");
const accessLevelMiddleware = require("../../../utils/middlewares/accessLevelMiddleware");
const { roles } = require("../../../utils/constants");
const {
  createTicket,
  answerTicketByAdmin,
  answerTicketByUser,
  getAllTicketsByUser,
  getTicket,
  getAllUnAnsweredTickets,
  getAll,
} = require("./controller");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createTicket)
  .get(authMiddleware, accessLevelMiddleware(roles.manager), getAll);
router
  .route("/unAnswered")
  .get(
    authMiddleware,
    accessLevelMiddleware(roles.admin),
    getAllUnAnsweredTickets
  );
router.route("/user").get(authMiddleware, getAllTicketsByUser);
router
  .route("/answerByAdmin/:id")
  .post(
    authMiddleware,
    accessLevelMiddleware(roles.admin),
    answerTicketByAdmin
  );
router.route("/answerByUser/:id").post(authMiddleware, answerTicketByUser);
router.route("/:id").get(authMiddleware, getTicket);

module.exports = router;
