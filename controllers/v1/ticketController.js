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

    const findedTicket = await ticketModel
      .findOne({ _id: answerTicket._id })
      .populate("userId", "firstname lastname")
      .populate("departmentId", "title")
      .select("-__v")
      .lean();

    return res.status(201).json({
      message: "Ticket created successfully :))",
      ticket: findedTicket,
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

    const newTicket = await ticketModel
      .findOne({ _id: answerTicket._id })
      .populate("userId", "firstname lastname")
      .populate("departmentId", "title")
      .select("-__v")
      .lean();

    return res.status(200).json({
      message: "Answer Ticket added successfully :))",
      ticket: newTicket,
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

    const newTicket = await ticketModel
      .findOne({ _id: answerTicket._id })
      .populate("userId", "firstname lastname")
      .populate("departmentId", "title")
      .select("-__v")
      .lean();

    return res.status(200).json({
      message: "Answer Ticket added successfully :))",
      ticket: newTicket,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllTicketsByUser = async (req, res) => {
  try {
    const tickets = await ticketModel
      .find({ userId: req.user._id, mainTicketId: null })
      .select("-__v")
      .lean();
    if (!tickets) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTicket = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "TicketId is not valid !!" });
  }

  try {
    const ticket = await ticketModel
      .findOne({ _id: id, userId: req.user._id, mainTicketId: null })
      .populate("userId", "firstname lastname")
      .populate("departmentId", "title")
      .populate({
        path: "children",
        select: "-__v",
        populate: [
          {
            path: "userId",
            select: "firstname lastname",
          },
          {
            path: "departmentId",
            select: "title",
          },
        ],
      })
      .select("-__v")
      .lean();
    if (!ticket) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  answerTicketByAdmin,
  answerTicketByUser,
  getAllTicketsByUser,
  getTicket,
};
