const discountCodeModel = require("../../models/discountCode");
const courseModel = require("../../models/course");
const discountAllValidate = require("../../validators/discountCodes/discountAll");

const discountAllCourses = async (req, res) => {
  const isValidRequestBody = discountAllValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(discountAllValidate.errors);
  }

  const { discount } = req.body;
  try {
    const updateCourses = await courseModel.updateMany({}, { discount });
    const courses = await courseModel
      .find({})
      .select("title cover teacherId discount")
      .populate("studentsCount")
      .populate("teacherId", "firstname lastname")
      .lean();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { discountAllCourses };
