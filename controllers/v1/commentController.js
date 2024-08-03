const { isValidObjectId } = require("mongoose");
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
    Reflect.deleteProperty(newCommentObject, "userId");
    Reflect.deleteProperty(newCommentObject, "courseId");

    return res.status(201).json({
      message: "Comment added successfully :))",
      comment: newCommentObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeComment = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "CommentId is not valid !!" });
  }

  try {
    const comment = await commentModel
      .findOneAndDelete({ _id: id })
      .populate("userId courseId", "username title cover")
      .select("-__v");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found !!" });
    }
    return res
      .status(200)
      .json({ message: "Comment deleted successfully :))", comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const acceptComment = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "CommentId is not valid !!" });
  }

  try {
    const comment = await commentModel
      .findByIdAndUpdate(
        { _id: id },
        {
          isAccepted: true,
        }
      )
      .populate("userId courseId", "username title cover")
      .select("-__v");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found !!" });
    }
    return res
      .status(200)
      .json({ message: "Comment updated successfully :))", comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, removeComment, acceptComment };
