const { default: teacherModel } = require("../../models/teacher");
const { default: userModel } = require("../../models/user");
const {
  default: teacherValidate,
} = require("../../validators/teachers/teacher");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const { isValidObjectId } = require("mongoose");

const addTeacher = async (req, res) => {
  const isValidRequestBody = teacherValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(teacherValidate.errors);
  }

  const { userId } = req.body;

  const isValidId = isValidObjectId(userId);
  if (!isValidId) {
    return res.status(422).json({ message: "UserId is not valid !!" });
  }

  try {
    const isUserExist = await userModel.findOne({ _id: userId }).lean();
    if (!isUserExist) {
      return res.status(400).json({ message: "User not found !!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  try {
    await checkDBCollectionIndexes(teacherModel);
  } catch (err) {
    const isTacherExistBefore = await teacherModel
      .findOne({
        $or: [{ userId }],
      })
      .lean();
    if (isTacherExistBefore) {
      return res.status(422).json({ message: "Teacher is already exist !!" });
    }
  }

  try {
    const newTeacher = await teacherModel.create(req.body);
    if (!newTeacher) {
      return res.status(500).json({ message: "Add Teacher failed !!" });
    }

    const newTeacherObject = newTeacher.toObject();
    Reflect.deleteProperty(newTeacherObject, "__v");

    return res.status(201).json({
      message: "Teacher added successfully :))",
      teacher: newTeacherObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeTeacher = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "TeacherId is not valid !!" });
  }

  try {
    const teacher = await teacherModel.findOneAndDelete({ _id: id });
    if (!teacher) {
      return res.status(404).json({ message: "Categroy not found !!" });
    }
    return res
      .status(200)
      .json({ message: "Teacher removed successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTeacher,
  removeTeacher,
};
