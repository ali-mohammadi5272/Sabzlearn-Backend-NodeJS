const { isValidObjectId } = require("mongoose");
const { default: userModel } = require("../../models/user");
const { default: banUserModel } = require("../../models/banUser");
const { phoneNumberPrefixPattern } = require("../../utils/patterns");

const banUser = async (req, res) => {
  const { phone } = req.body;
  const changedPhoneNumber = phone.replace(phoneNumberPrefixPattern, "");

  try {
    await checkDBCollectionIndexes(banUserModel);
  } catch (err) {
    const isUserExistBefore = await banUserModel
      .findOne({ phone: changedPhoneNumber })
      .lean();
    if (isUserExistBefore) {
      return res.status(422).json({ message: "User is already in banList !!" });
    }
  }

  try {
    const newBanUser = await banUserModel.create({ phone: changedPhoneNumber });
    if (!newBanUser) {
      return res.status(500).json({ message: "Add User to banList failed !!" });
    }
    return res.status(201).json({
      message: "User added to banList successfully :))",
      user: newBanUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  banUser,
};
