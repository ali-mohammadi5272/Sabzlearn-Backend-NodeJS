const { default: banUserModel } = require("../../models/banUser");
const { phoneNumberPrefixPattern } = require("../../utils/patterns");

const banUser = async (req, res) => {
  const { phone } = req.body;
  const changedPhoneNumber = phone.replace(phoneNumberPrefixPattern, "");

  try {
    await checkDBCollectionIndexes(banUserModel);
  } catch (err) {
    const isUserExistBefore = await banUserModel
      .findOne({ changedPhoneNumber })
      .lean();
    if (isUserExistBefore) {
      return res.status(422).json({ message: "User is already exist !!" });
    }
  }

  try {
    const newBanUser = await banUserModel.create({ phone: changedPhoneNumber });
    if (!newBanUser) {
      return res.status(500).json({ message: "Add User failed !!" });
    }
    return res
      .status(201)
      .json({ message: "User added successfully :))", user: newBanUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  banUser,
};
