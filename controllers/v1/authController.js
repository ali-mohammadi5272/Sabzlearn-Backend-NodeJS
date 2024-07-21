const { default: userModel } = require("../../models/user");
const { default: registerValidate } = require("../../validators/auth/register");
const { default: loginValidate } = require("../../validators/auth/login");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const {
  generateAccessToken,
  hashPassword,
  isValidHashedPassword,
} = require("../../utils/auth");
const { phoneNumberPrefixPattern } = require("../../utils/patterns");

const register = async (req, res) => {
  const isValidRequestBody = registerValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json({ message: registerValidate.error });
  }
  const { password, phone, email, username } = req.body;

  try {
    await checkDBCollectionIndexes(userModel);
  } catch (err) {
    const isUserExistBefore = await userModel.findOne({
      $or: [{ email }, { phone }, { username }],
    });
    if (isUserExistBefore) {
      return res.status(422).json({ message: "User is already exist !!" });
    }
  }

  try {
    const hashedPassword = await hashPassword(password);
    const changedPhoneNumber = phone.replace(phoneNumberPrefixPattern, "");

    const newUser = await userModel.create({
      ...req.body,
      phone: changedPhoneNumber,
      password: hashedPassword,
    });
    if (!newUser) {
      return res.status(500).json({ message: "User registration faild !!" });
    }
    const newUserObject = newUser.toObject();
    Reflect.deleteProperty(newUserObject, "password");
    Reflect.deleteProperty(newUserObject, "__v");

    const accessToken = generateAccessToken({ _id: newUserObject._id });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 24,
      httpOnly: true,
    });
    return res
      .status(201)
      .json({ message: "User added successfully :))", user: newUserObject });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const isValidRequestBody = loginValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json({ message: loginValidate.error });
  }
  const { username, email, password } = req.body;
  try {
    const findedUser = await userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .lean();
    if (!findedUser) {
      return res.status(404).json({ message: "User not found !!" });
    }
    const isValidPassword = await isValidHashedPassword(
      password,
      findedUser.password
    );
    if (!isValidPassword) {
      return res
        .status(422)
        .json({ message: "Username/Email or Password is not valid !!" });
    }
    const accessToken = generateAccessToken({ _id: findedUser._id });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 24,
      httpOnly: true,
    });
    return res.status(200).json({ message: "Login successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
