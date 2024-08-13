const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    hasBeenAnswered: {
      type: Number,
      enum: [0, 1], // 0 => not answered , 1 => answered
      default: 0,
    },
    isAnswer: {
      type: Number, // 0 => question , 1 => answer
      enum: [0, 1],
      default: 0,
    },
    mainTicketId: {
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
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
