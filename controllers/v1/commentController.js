const { default: commentModel } = require("../../models/comment");
const { default: courseModel } = require("../../models/course");

const {
  default: commentValidate,
} = require("../../validators/comments/comment");

const addComment = async (req, res) => {
  const isValidRequestBody = commentValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(commentValidate.errors);
  }

  try {
    const course = await courseModel.findOne({ _id: req.body.courseId }).lean();
    if (!course) {
      return res.status(422).json({ message: "Course not found !!" });
    }
    const newComment = await commentModel.create({
      ...req.body,
      userId: req.user._id,
      isAccepted: false,
    });
    if (!newComment) {
      return res.status(500).json({ message: "Add Comment failed !!" });
    }

    const newCommentObject = newComment.toObject();
    Reflect.deleteProperty(newCommentObject, "__v");

    return res.status(201).json({
      message: "Comment added successfully :))",
      comment: newCommentObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment };
