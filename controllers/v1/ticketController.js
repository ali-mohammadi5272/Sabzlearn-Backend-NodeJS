const ticketModel = require("../../models/ticket");
const departmentModel = require("../../models/department");
const sendTicketValidate = require("../../validators/tickets/sendTicket");

const sendTicket = async (req, res) => {
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
      return res.status(500).json({ message: "Add Ticket failed !!" });
    }

    const newTicketObject = newTicket.toObject();
    Reflect.deleteProperty(newTicketObject, "__v");
    Reflect.deleteProperty(newTicketObject, "userId");
    Reflect.deleteProperty(newTicketObject, "departmentId");
    Reflect.deleteProperty(newTicketObject, "updatedAt");

    return res.status(201).json({
      message: "Ticket added successfully :))",
      ticket: newTicketObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendTicket,
};
