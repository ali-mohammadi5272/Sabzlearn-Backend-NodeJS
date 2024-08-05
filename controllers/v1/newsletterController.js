const newsletterModel = require("../../models/newsletter");

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

module.exports = { getAll };
