const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
    },
    cover: {
      type: String,
      required: true,
    },
    introduceVideo: {
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
      ref: "Teacher",
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
      default: [],
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["preSell", "in Process", "completed", "stop selling"],
      required: true,
    },
  },
  { timestamps: true }
);

schema.virtual("sessions", {
  ref: "Session",
  localFields: "_id",
  foreignFields: "courseId",
});

const model = mongoose.models.Course || mongoose.model("Course", schema);

module.exports = {
  schema,
  default: model,
};