const userCourseModel = require("../../models/userCourse");

const getUserOrders = async (req, res) => {
  const orders = await userCourseModel
    .find({ userId: req.user._id })
    .populate("courseId", "title cover price teacherId ")
    .select("price")
    .lean();
  if (!orders) {
    return res.status(500).json({ message: "Internal Server Error !!" });
  }
  return res.status(200).json(orders);
};

module.exports = { getUserOrders };
