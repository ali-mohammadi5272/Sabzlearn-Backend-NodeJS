const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
      trim: true,
      unique: true,
    },
    cover: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      trim: true,
      required: true,
    },
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      trim: true,
      required: true,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      trim: true,
      required: true,
    },
    href: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    publish: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
  },
  { timestamps: true }
);

schema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "articleId",
});

const model = mongoose.models.Article || mongoose.model("Article", schema);

module.exports = model;
