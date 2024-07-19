const mongoose = require("mongoose");
const { roles } = require("../utils/constants");

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
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[1-9]\d{9}$/,
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
      enum: [roles.manager, roles.admin, roles.user],
      default: roles.user,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.User || mongoose.model("User", schema);

module.exports = {
  schema,
  default: model,
};
