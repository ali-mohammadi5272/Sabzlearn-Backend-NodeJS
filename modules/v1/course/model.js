const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
      unique: true,
    },
    cover: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    teacherId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    supportMethod: {
      type: String,
      required: true,
    },
    watchMethod: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    qualification: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["preSell", "in-Process", "completed", "stop-selling"],
      required: true,
    },
  },
  { timestamps: true }
);

schema.virtual("sessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "courseId",
});

schema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "courseId",
});

schema.virtual("studentsCount", {
  ref: "UserCourse",
  count: true,
  localField: "_id",
  foreignField: "courseId",
});

const model = mongoose.models.Course || mongoose.model("Course", schema);

module.exports = model;
