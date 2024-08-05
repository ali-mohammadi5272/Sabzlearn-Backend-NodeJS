const mongoose = require("mongoose");
const { sessionTimePattern } = require("../utils/patterns");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 1,
      uniqe: true,
    },
    time: {
      type: String,
      required: true,
      match: sessionTimePattern,
    },
    free: {
      type: Boolean,
      required: true,
      enum: [true, false],
    },
    video: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.Session || mongoose.model("Session", schema);

module.exports = model;
