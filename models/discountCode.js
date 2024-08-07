const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      minLength: 4,
      required: true,
      unique: true,
    },
    percent: {
      type: Number,
      min: 0,
      max: 100,
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
    expireTime: {
      type: Date,
      min: new Date().getTime(),
      required: true,
    },
    uses: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

const model =
  mongoose.models.DiscountCode || mongoose.model("DiscountCode", schema);

module.exports = model;
