require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { isValidObjectId } = require("mongoose");
const courseModel = require("../../models/course");
const userCourseModel = require("../../models/userCourse");
const { default: categoryModel } = require("../../models/category");
const { userRegisterInApplicationInfo } = require("../../utils/auth");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const { default: courseValidate } = require("../../validators/courses/course");
const {
  default: registerCourseValidate,
} = require("../../validators/courses/registerCourse");

const getAll = async (req, res) => {
  try {
    const courses = await courseModel
      .find({})
      .populate("teacherId", "firstname lastname")
      .populate("categoryId", "title")
      .select("title cover price discount status teacherId categoryId")
      .populate("studentsCount")
      .lean();
    if (!courses) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPopularCourses = async (req, res) => {
  try {
    const courses = await courseModel
      .find({})
      .populate("teacherId", "firstname lastname")
      .populate("categoryId", "title")
      .select("title cover price discount status teacherId categoryId")
      .populate("studentsCount")
      .lean();
    if (!courses) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    const coursesClone = Object.assign([], courses);
    const sortedCourses = coursesClone.sort(
      (prev, current) => current.studentsCount - prev.studentsCount
    );
    return res.status(200).json(sortedCourses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

const getCourse = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "CourseId is not valid !!" });
  }

  try {
    const course = await courseModel
      .findOne({ _id: id })
      .populate("teacherId", "firstname lastname")
      .populate("categoryId", "title")
      .populate("sessions", "title time free -courseId")
      .populate({
        path: "comments",
        match: { isAccepted: true, mainCommentId: null },
        select: "body score -courseId createdAt",
        populate: [
          {
            path: "userId",
            select: "username",
          },
          {
            path: "children",
            select: "createdAt body",
            populate: {
              path: "userId",
              select: "username",
            },
          },
        ],
      })
      .populate("studentsCount")
      .select("-__v")
      .lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found !!" });
    }

    const relatedCourses = await courseModel
      .find({
        categoryId: course.categoryId,
        _id: { $ne: course._id },
      })
      .select("title cover")
      .lean();

    const user = await userRegisterInApplicationInfo(req);
    if (!user) {
      return res.status(200).json({
        ...course,
        isUserRegisteredToThisCourse: false,
        relatedCourses,
      });
    }

    const isUserRegisteredToThisCourse = !!(await userCourseModel.findOne({
      userId: user._id,
      courseId: course._id,
    }));

    return res.status(200).json({
      ...course,
      isUserRegisteredToThisCourse,
      relatedCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const registerCourse = async (req, res) => {
  const isValidRequestBody = registerCourseValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(registerCourseValidate.errors);
  }

  try {
    const course = await courseModel.findOne({ _id: req.body.courseId }).lean();
    if (!course) {
      return res.status(422).json({ message: "Course not found !!" });
    }

    const userCourseExist = await userCourseModel
      .findOne({
        userId: req.user._id,
        courseId: req.body.courseId,
      })
      .lean();
    if (userCourseExist) {
      return res
        .status(409)
        .json({ message: "You have already registered for this course !!" });
    }

    const newRegisterCourse = await userCourseModel.create({
      ...req.body,
      userId: req.user._id,
    });
    if (!newRegisterCourse) {
      return res.status(500).json({ message: "Register failed !!" });
    }

    const newRegisterCourseObject = newRegisterCourse.toObject();
    Reflect.deleteProperty(newRegisterCourseObject, "__v");

    return res.status(201).json({
      message: "Congratulations 🥳. You have registered successfully :))",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCoursesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const isValidId = isValidObjectId(categoryId);
  if (!isValidId) {
    return res.status(422).json({ message: "CategoryId is not valid !!" });
  }
  try {
    const category = await categoryModel.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found !!" });
    }

    const courses = await courseModel
      .find({ categoryId })
      .select("title cover price discount")
      .lean();
    if (!courses) {
      return res.status(404).json({
        message: `Courses with ${category.title} Category not found !!`,
      });
    }

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeCourse = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "Course Id is not valid !!" });
  }

  try {
    const findedCourse = await courseModel.findOne({ _id: id });
    if (!findedCourse) {
      return res.status(404).json({ message: "Course not found !!" });
    }
    fs.unlinkSync(
      path.join(process.cwd(), "public/courses/covers", findedCourse.cover)
    );
    const course = await courseModel
      .findOneAndDelete({ _id: findedCourse._id })
      .select("-__v");

    if (!course) {
      return res.status(404).json({ message: "Delete Course faild !!" });
    }
    return res
      .status(200)
      .json({ message: "Course removed successfully :))", course });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  addCourse,
  getCourse,
  registerCourse,
  getCoursesByCategory,
  removeCourse,
  getPopularCourses,
};
