const contactUsModel = require("./model");
const contactUsValidate = require("../../../utils/validators/contactUs/contactUs");
const answerMessageValidate = require("../../../utils/validators/contactUs/answerMessage");
const nodemailer = require("nodemailer");
const { phoneNumberPrefixPattern } = require("../../../utils/patterns");
const { isValidObjectId } = require("mongoose");

const sendMessage = async (req, res) => {
  const isValidRequestBody = contactUsValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(contactUsValidate.errors);
  }

  const { phone } = req.body;
  const changedPhoneNumber = phone.replace(phoneNumberPrefixPattern, "");

  try {
    const newMessage = await contactUsModel.create({
      ...req.body,
      phone: changedPhoneNumber,
    });
    if (!newMessage) {
      return res.status(500).json({ message: "Sent Message failed !!" });
    }

    const newMessageObject = newMessage.toObject();
    Reflect.deleteProperty(newMessageObject, "__v");

    return res.status(201).json({
      message: "Message sent successfully :))",
      sendedMessage: newMessageObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const answerMessage = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "MessageId is not valid !!" });
  }

  const isValidRequestBody = answerMessageValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(answerMessageValidate.errors);
  }

  const { subject, body } = req.body;
  try {
    const findedMessage = await contactUsModel.findOne({ _id: id });

    if (!findedMessage) {
      return res.status(404).json({ message: "Message not found !!" });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "example@gmail.com",
        pass: "App Password",
      },
    });
    const mailOption = {
      from: "example@gmail.com",
      to: findedMessage.email,
      text: body,
      subject,
    };

    transporter.sendMail(mailOption, async (err, info) => {
      if (err) {
        return res.status(500).json({ message: err });
      }

      const updatedMessage = await contactUsModel.findOneAndUpdate(
        { _id: id },
        {
          hasBeenAnswered: true,
        }
      );
      if (!updatedMessage) {
        return res.status(500).json({ message: "Update Message failed !!" });
      }
      return res.status(201).json({
        message: "Message sent successfully :))",
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllByManager = async (req, res) => {
  try {
    const contacts = await contactUsModel.find({}).select("-__v").lean();
    if (!contacts) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUnAnswered = async (req, res) => {
  try {
    const contacts = await contactUsModel
      .find({ hasBeenAnswered: 0 })
      .select("-__v")
      .lean();
    if (!contacts) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  answerMessage,
  getAllByManager,
  getAllUnAnswered,
};
