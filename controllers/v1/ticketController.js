const ticketModel = require("../../models/ticket");
const departmentModel = require("../../models/department");
const sendTicketValidate = require("../../validators/tickets/sendTicket");
const answerTicketValidate = require("../../validators/tickets/answerTicket");
const { isValidObjectId } = require("mongoose");

const createTicket = async (req, res) => {
  const isValidRequestBody = sendTicketValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(sendTicketValidate.errors);
  }

  try {
    const department = await departmentModel
      .findOne({ _id: req.body.departmentId })
      .lean();
    if (!department) {
      return res.status(422).json({ message: "Department not found !!" });
    }
    const newTicket = await ticketModel.create({
      ...req.body,
      userId: req.user._id,
      hasBeenAnswered: 0,
      isAnswer: 0,
      mainTicketId: null,
    });
    if (!newTicket) {
      return res.status(500).json({ message: "Create Ticket failed !!" });
    }

    const newTicketObject = newTicket.toObject();
    Reflect.deleteProperty(newTicketObject, "__v");
    Reflect.deleteProperty(newTicketObject, "userId");
    Reflect.deleteProperty(newTicketObject, "departmentId");
    Reflect.deleteProperty(newTicketObject, "updatedAt");

    return res.status(201).json({
      message: "Ticket created successfully :))",
      ticket: newTicketObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const answerTicketByAdmin = async (req, res) => {
  const isValidRequestBody = answerTicketValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(answerTicketValidate.errors);
  }

  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "TicketId is not valid !!" });
  }

  const { body } = req.body;

  try {
    const ticket = await ticketModel.findOneAndUpdate(
      { _id: id, mainTicketId: null },
      {
        hasBeenAnswered: 1,
      }
    );
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found !!" });
    }

    const answerTicket = await ticketModel.create({
      title: "Ticket's Answer By Admin",
      body,
      userId: req.user._id,
      departmentId: ticket.departmentId,
      hasBeenAnswered: 0,
      isAnswer: 1,
      mainTicketId: ticket._id,
    });

    if (!answerTicket) {
      return res.status(404).json({ message: "Add Answer Ticket faild !!" });
    }

    const answerTicketObject = answerTicket.toObject();
    Reflect.deleteProperty(answerTicketObject, "__v");

    return res.status(200).json({
      message: "Answer Ticket added successfully :))",
      ticket: answerTicketObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const answerTicketByUser = async (req, res) => {
  const isValidRequestBody = answerTicketValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(answerTicketValidate.errors);
  }

  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "TicketId is not valid !!" });
  }

  const { body } = req.body;

  try {
    const ticket = await ticketModel.findOneAndUpdate(
      { _id: id, userId: req.user._id, mainTicketId: null },
      {
        hasBeenAnswered: 0,
      }
    );
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found !!" });
    }

    const answerTicket = await ticketModel.create({
      title: "Ticket's Answer By User",
      body,
      userId: ticket.userId,
      departmentId: ticket.departmentId,
      hasBeenAnswered: 0,
      isAnswer: 0,
      mainTicketId: ticket._id,
    });

    if (!answerTicket) {
      return res.status(404).json({ message: "Add Answer Ticket faild !!" });
    }

    const answerTicketObject = answerTicket.toObject();
    Reflect.deleteProperty(answerTicketObject, "__v");

    return res.status(200).json({
      message: "Answer Ticket added successfully :))",
      ticket: answerTicketObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  answerTicketByAdmin,
  answerTicketByUser,
};
