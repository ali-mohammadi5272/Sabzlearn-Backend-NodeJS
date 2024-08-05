const mongoose = require("mongoose");
const { emailPattern, phoneNumberPattern } = require("../utils/patterns");

const schema = new mongoose.Schema({
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
    type: Boolean,
    default: false,
    trim: true,
  },
  isAnswer: {
    type: Boolean,
    default: false,
    trim: true,
  },
  mainContactUsMessageId: {
    type: mongoose.Types.ObjectId,
    ref: "ContactUs",
    default: null,
    trim: true,
  },
});

schema.virtual("children", {
  ref: "ContactUs",
  localField: "_id",
  foreignField: "mainContactUsMessageId",
});

const model = mongoose.models.ContactUs || mongoose.model("ContactUs", schema);

module.exports = model;
