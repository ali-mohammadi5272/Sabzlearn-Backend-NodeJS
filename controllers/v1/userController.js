const { isValidObjectId } = require("mongoose");
const { default: userModel } = require("../../models/user");
const { default: banUserModel } = require("../../models/banUser");
const { roles } = require("../../utils/constants");
const {
  default: updateUserValidate,
} = require("../../validators/users/updateUser");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const { hashPassword, generateAccessToken } = require("../../utils/auth");
const { phoneNumberPrefixPattern } = require("../../utils/patterns");

const getAll = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-__v -password").lean();
    if (!users) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "UserId is not valid !!" });
  }

  try {
    const user = await userModel
      .findOne({ _id: id })
      .select("-__v -password")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found !!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeUser = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "UserId is not valid !!" });
  }

  try {
    const user = await userModel
      .findOneAndDelete({ _id: id })
      .select("-__v -password")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found !!" });
    }
    return res.status(200).json({ message: "User deleted successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const changeRole = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "UserId is not valid !!" });
  }

  try {
    const user = await userModel
      .findOne({ _id: id })
      .select("-__v -password")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found !!" });
    }
    const newRole = user.role === roles.admin ? roles.user : roles.admin;
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id },
      { role: newRole }
    );
    if (!updatedUser) {
      return res.status(500).json({ message: "Update User faild !!" });
    }
    return res
      .status(200)
      .json({ message: "User's Role changed successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const isValidRequestBody = updateUserValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(updateUserValidate.errors);
  }

  const { password, phone } = req.body;
  const changedPhoneNumber = phone.replace(phoneNumberPrefixPattern, "");

  try {
    const hashedPassword = await hashPassword(password);
    const updatedUser = await userModel
      .findByIdAndUpdate(
        { _id: req.user._id },
        {
          ...req.body,
          phone: changedPhoneNumber,
          password: hashedPassword,
        }
      )
      .select("-__v -password");
    if (!updatedUser) {
      return res.status(500).json({ message: "User update faild !!" });
    }

    const accessToken = generateAccessToken({ _id: updatedUser._id });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 24,
      httpOnly: true,
    });
    return res.status(201).json({
      message: "User updated successfully :))",
      user: updatedUser,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const banUser = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  let findedUser;

  if (!isValidId) {
    return res.status(422).json({ message: "UserId is not valid !!" });
  }

  try {
    const user = await userModel
      .findOne({ _id: id })
      .select("-__v -password")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found !!" });
    }
    findedUser = structuredClone(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  try {
    await checkDBCollectionIndexes(banUserModel);
  } catch (err) {
    const isUserExistBefore = await banUserModel
      .findOne({ phone: findedUser.phone })
      .lean();
    if (isUserExistBefore) {
      return res.status(422).json({ message: "User is already in banList !!" });
    }
  }

  try {
    const newBanUser = await banUserModel.create({ phone: findedUser.phone });
    if (!newBanUser) {
      return res.status(500).json({ message: "Add User to banList failed !!" });
    }
    return res.status(201).json({
      message: "User added to banList successfully :))",
      user: findedUser,
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
      return res
        .status(500)
        .json({ message: "Remove User from banList failed !!" });
    }
    return res
      .status(200)
      .json({ message: "User removed from banList successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getUser,
  removeUser,
  changeRole,
  updateUser,
  banUser,
  freeUser,
};
