const mongoose = require("mongoose");
const { phoneNumberPattern } = require("../../../utils/patterns");

const schema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      match: phoneNumberPattern,
      unique: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.BanUser || mongoose.model("BanUser", schema);

module.exports = model;
