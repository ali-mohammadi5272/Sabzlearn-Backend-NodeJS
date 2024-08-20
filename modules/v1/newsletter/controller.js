const newsletterModel = require("../../models/newsletter");
const newsletterValidate = require("../../validators/newsletter/newsletter");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");

const getAll = async (req, res) => {
  try {
    const newsletters = await newsletterModel.find({}).select("-__v").lean();
    if (!newsletters) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(newsletters);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const registerNewsletter = async (req, res) => {
  const isValidRequestBody = newsletterValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(newsletterValidate.errors);
  }

  const { email } = req.body;

  try {
    await checkDBCollectionIndexes(newsletterModel);
  } catch (err) {
    const isEmailExistBefore = await newsletterModel.findOne({
      $or: [{ email }],
    });
    if (isEmailExistBefore) {
      return res.status(422).json({ message: "Email is already exist !!" });
    }
  }

  try {
    const newletter = await newsletterModel.create(req.body);
    if (!newletter) {
      return res.status(500).json({ message: "Add Newsletter failed !!" });
    }

    const newletterObject = newletter.toObject();
    Reflect.deleteProperty(newletterObject, "__v");

    return res.status(201).json({
      message: "Newsletter added successfully :))",
      newletter: newletterObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, registerNewsletter };
