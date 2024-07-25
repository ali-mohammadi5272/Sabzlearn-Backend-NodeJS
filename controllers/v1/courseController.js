require("dotenv").config();
const { default: courseModel } = require("../../models/course");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const { default: courseValidate } = require("../../validators/courses/course");

const addCourse = async (req, res) => {
  req.body.price = +req.body.price;
  req.body.qualification = JSON.parse(req.body.qualification);
  req.body.discount = +req.body.discount;

  const isValidRequestBody = courseValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(courseValidate.errors);
  }

  const { title } = req.body;

  try {
    await checkDBCollectionIndexes(courseModel);
  } catch (err) {
    const isCourseExistBefore = await courseModel
      .findOne({
        $or: [{ title }],
      })
      .lean();
    if (isCourseExistBefore) {
      return res.status(422).json({ message: "Course is already exist !!" });
    }
  }

  try {
    const newCourse = await courseModel.create({
      ...req.body,
      teacherId: req.user._id,
      cover: req.file.filename,
    });
    if (!newCourse) {
      return res.status(500).json({ message: "Add Course failed !!" });
    }

    const findedCourse = await courseModel
      .findOne({ _id: newCourse._id })
      .populate("teacherId categoryId", "firstname lastname title href")
      .lean();

    return res.status(201).json({
      message: "Course added successfully :))",
      course: findedCourse,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addCourse };
