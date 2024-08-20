const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
      required: true,
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seen: {
      type: Number,
      enum: [0, 1], // 0 => false, 1 => true
      default: 0,
    },
  },
  { timestamps: true }
);

const model =
  mongoose.models.Notification || mongoose.model("Notification", schema);

module.exports = model;
