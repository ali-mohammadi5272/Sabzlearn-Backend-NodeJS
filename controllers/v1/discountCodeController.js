const discountCodeModel = require("../../models/discountCode");
const courseModel = require("../../models/course");
const discountAllValidate = require("../../validators/discountCodes/discountAll");
const useDsicountCodeValidate = require("../../validators/discountCodes/useDsicountCode");
const addDiscountCodeValidate = require("../../validators/discountCodes/addDiscountCode");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const { isValidObjectId } = require("mongoose");

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
    const newCode = await discountCodeModel.create({
      ...req.body,
      creator: req.user._id,
    });
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
      .populate({
        path: "courseId",
        select: "title cover price discount studentsCount",
        populate: "studentsCount",
      })
      .populate("creator", "firstname lastname")
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

const getDiscountCode = async (req, res) => {
  const isValidRequest = useDsicountCodeValidate(req.params);
  if (!isValidRequest) {
    return res.status(422).json(useDsicountCodeValidate.errors);
  }
  const { code, courseId } = req.params;
  try {
    const findedDiscountCode = await discountCodeModel
      .findOne({ code, courseId })
      .select("-__v -creator -createdAt -updatedAt");

    if (!findedDiscountCode) {
      return res.status(404).json({ message: "DiscountCode not found !!" });
    }

    const { maxUse, uses, expireTime } = findedDiscountCode;

    if (new Date().getTime() > new Date(expireTime).getTime()) {
      return res
        .status(410)
        .json({ message: "This discount code has expired !!" });
    }

    if (uses >= maxUse) {
      return res
        .status(410)
        .json({ message: "The discount code is no longer valid !!" });
    }
    return res.status(200).json(findedDiscountCode);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeDsicountCode = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "DiscountCodeId is not valid !!" });
  }

  try {
    const code = await discountCodeModel.findOneAndDelete({ _id: id });
    if (!code) {
      return res.status(404).json({ message: "DiscountCode not found !!" });
    }
    return res
      .status(200)
      .json({ message: "DiscountCode removed successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const useDiscountCode = async (req, res) => {
  const isValidRequest = useDsicountCodeValidate(req.params);
  if (!isValidRequest) {
    return res.status(422).json(useDsicountCodeValidate.errors);
  }
  const { code } = req.params;
  try {
    const findedDiscountCode = await discountCodeModel.findOne({ code });

    if (!findedDiscountCode) {
      return res.status(404).json({ message: "DiscountCode not found !!" });
    }

    const { maxUse, uses, expireTime } = findedDiscountCode;

    if (new Date().getTime() > new Date(expireTime).getTime()) {
      return res
        .status(410)
        .json({ message: "This discount code has expired !!" });
    }

    if (uses >= maxUse) {
      return res
        .status(410)
        .json({ message: "The discount code is no longer valid !!" });
    }

    const updatedDiscountCode = await discountCodeModel.findOneAndUpdate(
      { code },
      {
        $inc: {
          uses: 1,
        },
      }
    );
    if (!updatedDiscountCode) {
      return res.status(404).json({ message: "DiscountCode not found !!" });
    }
    return res
      .status(200)
      .json({ message: "DiscountCode updated successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  discountAllCourses,
  addDiscountCode,
  getAll,
  getDiscountCode,
  removeDsicountCode,
  useDiscountCode,
};
