const { isValidObjectId } = require("mongoose");
const commentModel = require("../../models/comment");
const courseModel = require("../../models/course");

const {
  default: commentValidate,
} = require("../../validators/comments/comment");
const answerCommentValidate = require("../../validators/comments/answerComment");

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
      .findOneAndUpdate(
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
    return res.status(200).json({
      message: "Comment updated successfully :))",
      comment: {
        ...comment.toObject(),
        isAccepted: true,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const answerComment = async (req, res) => {
  const isValidRequestBody = answerCommentValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(answerCommentValidate.errors);
  }

  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "CommentId is not valid !!" });
  }
  const { body } = req.body;

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

    const answerComment = await commentModel.create({
      body,
      userId: req.user._id,
      courseId: comment.courseId,
      score: 5,
      isAccepted: true,
      isAnswer: true,
      mainCommentId: comment._id,
    });

    if (!answerComment) {
      return res.status(404).json({ message: "Added Answer Comment faild !!" });
    }

    const answerCommentObject = answerComment.toObject();
    Reflect.deleteProperty(answerCommentObject, "__v");

    return res.status(200).json({
      message: "Comment added successfully :))",
      comment: answerCommentObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const comments = await commentModel
      .find({ mainCommentId: null })
      .populate("userId", "username")
      .populate({
        path: "children",
        select: "userId isAccepted createdAt body mainCommentId",
        populate: {
          path: "userId",
          select: "username createdAt body",
        },
      })
      .select("body createdAt isAccepted mainCommentId")
      .lean();
    if (!comments) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  removeComment,
  acceptComment,
  answerComment,
  getAll,
};
