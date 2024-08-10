const discountCodeModel = require("../../models/discountCode");
const courseModel = require("../../models/course");
const discountAllValidate = require("../../validators/discountCodes/discountAll");
const addDiscountCodeValidate = require("../../validators/discountCodes/addDiscountCode");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");

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

const addDiscountCode = async (req, res) => {
  const isValidRequestBody = addDiscountCodeValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(addDiscountCodeValidate.errors);
  }

  const { code } = req.body;

  try {
    await checkDBCollectionIndexes(discountCodeModel);
  } catch (err) {
    const isCodeExistBefore = await discountCodeModel
      .findOne({
        $or: [{ code }],
      })
      .lean();
    if (isCodeExistBefore) {
      return res
        .status(422)
        .json({ message: "Discount Code is already exist !!" });
    }
  }

  try {
    const newCode = await discountCodeModel.create({ ...req.body });
    if (!newCode) {
      return res
        .status(500)
        .json({ message: "Generate Discount Code failed !!" });
    }

    const newCodeObject = newCode.toObject();
    Reflect.deleteProperty(newCodeObject, "__v");

    return res.status(201).json({
      message: "Discount Code generated successfully :))",
      code: newCodeObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const discountCodes = await discountCodeModel
      .find({})
      .populate("courses", "title cover price discount")
      .select("-__v")
      .lean();
    if (!discountCodes) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(discountCodes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { discountAllCourses, addDiscountCode, getAll };
