const { default: userModel } = require("../models/user");
const { default: registerValidate } = require("../validators/auth/register");
const { default: loginValidate } = require("../validators/auth/login");
const {
  generateAccessToken,
  hashPassword,
  isValidHashedPassword,
} = require("../utils/auth");

const register = async (req, res) => {
  const isValidRequestBody = registerValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json({ message: registerValidate.error });
  }
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const addedUser = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });
    if (!addedUser) {
      return res.status(500).json({ message: "User registration faild !!" });
    }
    const newAddedUser = JSON.parse(JSON.stringify(addedUser));
    const accessToken = generateAccessToken(newAddedUser);
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 24,
      httpOnly: true,
    });
    return res
      .status(201)
      .json({ message: "User added successfully :))", user: addedUser });
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
    const accessToken = generateAccessToken(findedUser);
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
