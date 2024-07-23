const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

schema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "teacherId",
});

const model = mongoose.models.Teacher || mongoose.model("Teacher", schema);

module.exports = {
  schema,
  default: model,
};
