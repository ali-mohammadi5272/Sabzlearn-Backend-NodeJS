const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    score: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 5,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isAnswer: {
      type: Boolean,
      required: true,
    },
    mainCommentId: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const model = mongoose.models.Comment || mongoose.model("Comment", schema);

module.exports = {
  schema,
  default: model,
};
