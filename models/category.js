const mongoose = require("mongoose");

const schema = new mongoose.Schema.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 1,
    },
    href: {
      type: String,
      required: true,
      unique: true,
      enum: ["front-end", "back-end"],
      minLength: 5,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.Category || mongoose.model("Category", schema);

module.exports = {
  schema,
  default: model,
};
