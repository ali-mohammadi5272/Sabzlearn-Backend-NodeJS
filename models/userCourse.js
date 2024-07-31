const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
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
    price: Number,
    min: 0,
  },
  { timestamps: true }
);

const model =
  mongoose.models.UserCourse || mongoose.model("UserCourse", schema);

module.exports = {
  schema,
  default: model,
};
