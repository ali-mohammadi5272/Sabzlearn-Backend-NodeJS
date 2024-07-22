const { isValidObjectId } = require("mongoose");
const { default: banUserModel } = require("../../models/banUser");
const { default: userModel } = require("../../models/user");
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
    await userModel.findOneAndDelete({
      phone: changedPhoneNumber,
    });
    return res.status(201).json({
      message: "User added to banList successfully :))",
      user: newBanUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const freeUser = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "UserId is not valid !!" });
  }
  try {
    const existUser = await banUserModel.findOne({ _id: id }).lean();
    if (!existUser) {
      return res.status(404).json({ message: "User not found !!" });
    }
    const deletedUser = await banUserModel.findOneAndDelete({ _id: id });
    if (!deletedUser) {
      return res.status(500).json({ message: "Remove User failed !!" });
    }
    return res.status(200).json({ message: "User deleted successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  banUser,
  freeUser,
};
