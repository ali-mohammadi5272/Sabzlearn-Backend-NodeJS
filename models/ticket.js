const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      trim: true,
      required: true,
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      trim: true,
      required: true,
    },
    hasBeenAnswered: {
      type: Number,
      enum: [0, 1], // 0 => not answered , 1 => answered
      default: 0,
    },
    mainTicketId: {
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

schema.virtual("children", {
  ref: "Ticket",
  localField: "_id",
  foreignField: "mainTicketId",
});

const model = mongoose.models.Ticket || mongoose.model("Ticket", schema);

module.exports = model;
