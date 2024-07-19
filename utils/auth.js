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
  const { tokenSecretKey, tokenExpiresTime } = process.env;
  const token = jwt.sign(data, tokenSecretKey, {
    expiresIn: tokenExpiresTime,
  });
  return token;
};

module.exports = {
  hashPassword,
  isValidHashedPassword,
  generateAccessToken,
};
