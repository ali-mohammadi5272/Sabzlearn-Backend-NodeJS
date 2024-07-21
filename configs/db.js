require("dotenv").config();
const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DBConnectionString);
    console.log("Connected to MongoDB successfully :))");
  } catch (err) {
    console.log("Error connecting to MongoDB !!", err);
  }
};

module.exports.default = connectToDB;
