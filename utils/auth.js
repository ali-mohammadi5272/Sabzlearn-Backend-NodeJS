require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../modules/v1/user/model");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const isValidHashedPassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

const generateAccessToken = (data) => {
  const { TokenSecretKey, TokenExpiresTime } = process.env;
  const token = jwt.sign(data, TokenSecretKey, {
    expiresIn: TokenExpiresTime,
  });
  return token;
};

const tokenPayloadData = (token) => {
  const { TokenSecretKey } = process.env;
  try {
    const tokenPayload = jwt.verify(token, TokenSecretKey);
    return tokenPayload;
  } catch (err) {
    return null;
  }
};

const decodedTokenData = (token) => {
  const tokenPayload = jwt.decode(token);
  return tokenPayload;
};

const userRegisterInApplicationInfo = async (req) => {
  try {
    const accessToken = req.cookies.accessToken;
    const tokenPayload = tokenPayloadData(accessToken);
    const { _id } = tokenPayload;
    const user = await userModel.findOne({ _id }).select("-__v -password");
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  isValidHashedPassword,
  generateAccessToken,
  tokenPayloadData,
  decodedTokenData,
  userRegisterInApplicationInfo,
};
