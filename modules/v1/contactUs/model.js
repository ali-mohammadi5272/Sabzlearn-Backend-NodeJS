const mongoose = require("mongoose");
const { emailPattern, phoneNumberPattern } = require("../../../utils/patterns");

const schema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minLength: 5,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: emailPattern,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: phoneNumberPattern,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      minLength: 1,
      trim: true,
    },
    hasBeenAnswered: {
      type: Number,
      enum: [0, 1],
      default: 0,
      trim: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.ContactUs || mongoose.model("ContactUs", schema);

module.exports = model;
