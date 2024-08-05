const mongoose = require("mongoose");
const { emailPattern } = require("../utils/patterns");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      match: emailPattern,
      unique: true,
    },
  },
  { timestamps: true }
);

const model =
  mongoose.models.Newsletter || mongoose.model("Newsletter", schema);

module.exports = model;
