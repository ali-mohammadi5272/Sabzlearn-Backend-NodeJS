const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    href: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Menu",
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

schema.virtual("subMenus", {
  ref: "Menu",
  localField: "_id",
  foreignField: "parent",
});

const model = mongoose.models.Menu || mongoose.model("Menu", schema);

module.exports = model;
