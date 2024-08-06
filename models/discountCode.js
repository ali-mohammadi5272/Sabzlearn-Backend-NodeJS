const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    percent: {
      type: Number,
      min: 0,
      required: true,
    },
    courses: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Course",
        },
      ],
      required: true,
    },
    maxUse: {
      type: Number,
      min: 0,
      required: true,
    },
    uses: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const model =
  mongoose.models.DiscountCode || mongoose.model("DiscountCode", schema);

module.exports = model;
