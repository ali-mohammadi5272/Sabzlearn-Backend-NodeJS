const mongoose = require("mongoose");
const { roles } = require("../../../utils/constants");
const { phoneNumberPattern, emailPattern } = require("../../../utils/patterns");

const schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      minLength: 5,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: emailPattern,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      match: phoneNumberPattern,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
    },
    role: {
      type: String,
      enum: [
        roles.manager,
        roles.admin,
        roles.teacher,
        roles.teacherHelper,
        roles.user,
      ],
      default: roles.user,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.User || mongoose.model("User", schema);

module.exports = model;
