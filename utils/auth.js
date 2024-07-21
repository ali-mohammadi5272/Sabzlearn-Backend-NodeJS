require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    console.log("Error verifying token !!", err);
    return null;
  }
};

const decodedTokenData = (token) => {
  const tokenPayload = jwt.decode(token);
  return tokenPayload;
};

module.exports = {
  hashPassword,
  isValidHashedPassword,
  generateAccessToken,
  tokenPayloadData,
  decodedTokenData,
};
