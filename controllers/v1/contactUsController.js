const contactUsModel = require("../../models/contactUs");
const contactUsValidate = require("../../validators/contactUs/contactUs");
const { phoneNumberPrefixPattern } = require("../../utils/patterns");

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

module.exports = { sendMessage };
