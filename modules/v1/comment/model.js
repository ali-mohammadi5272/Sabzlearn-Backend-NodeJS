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
      default: null,
    },
    articleId: {
      type: [mongoose.Types.ObjectId, null],
      ref: "Article",
      default: null,
    },
    score: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 5,
    },
    isAccepted: {
      type: Number,
      enum: [0, 1, 2], // 0 => not accepted , 1 => accepted , 2 => rejected
      default: 0,
    },
    isAnswer: {
      type: Boolean,
      required: true,
    },
    mainCommentId: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

schema.virtual("children", {
  ref: "Comment",
  localField: "_id",
  foreignField: "mainCommentId",
});

const model = mongoose.models.Comment || mongoose.model("Comment", schema);

module.exports = model;
