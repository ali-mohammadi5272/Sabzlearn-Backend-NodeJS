const fs = require("fs");
const { default: sessionModel } = require("../../models/session");
const courseModel = require("../../models/course");
const { isValidObjectId } = require("mongoose");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const {
  default: sessionValidate,
} = require("../../validators/sessions/session");
const path = require("path");

const getAll = async (req, res) => {
  try {
    const sessions = await sessionModel
      .find({})
      .select("-__v")
      .populate({
        path: "courseId",
        select: "title cover",
      })
      .lean();
    if (!sessions) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addSession = async (req, res) => {
  req.body.free = JSON.parse(req.body.free);
  const isValidRequestBody = sessionValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(sessionValidate.errors);
  }

  const { title } = req.body;

  try {
    await checkDBCollectionIndexes(sessionModel);
  } catch (err) {
    const isSessionExistBefore = await sessionModel
      .findOne({
        $or: [{ title }],
      })
      .lean();
    if (isSessionExistBefore) {
      return res.status(422).json({ message: "Session is already exist !!" });
    }
  }
  try {
    const newSession = await sessionModel.create({
      ...req.body,
      video: req.file.filename,
    });
    if (!newSession) {
      return res.status(500).json({ message: "Add Session failed !!" });
    }

    const newSessionObject = newSession.toObject();
    Reflect.deleteProperty(newSessionObject, "__v");

    return res.status(201).json({
      message: "Session added successfully :))",
      sesstion: newSessionObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSession = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "SessionId is not valid !!" });
  }

  try {
    const session = await sessionModel
      .findOne({ _id: id })
      .select("-__v")
      .lean();
    if (!session) {
      return res.status(404).json({ message: "Session not found !!" });
    }
    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeSession = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "SessionId is not valid !!" });
  }

  try {
    const findedSession = await sessionModel
      .findOne({ _id: id })
      .select("-__v")
      .lean();
    if (!findedSession) {
      return res.status(404).json({ message: "Session not found !!" });
    }
    fs.unlinkSync(
      path.join(process.cwd(), "public/courses/sessions", findedSession.video)
    );
    const session = await sessionModel
      .findOneAndDelete({ _id: id })
      .select("-__v")
      .lean();
    if (!session) {
      return res.status(404).json({ message: "Delete Session faild !!" });
    }
    return res
      .status(200)
      .json({ message: "Session removed successfully :))", session });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSessionAndAllCourseSessions = async (req, res) => {
  const { courseId, sessionId } = req.params;
  const isValidIdSessionId = isValidObjectId(sessionId);
  const isValidIdCourseId = isValidObjectId(courseId);
  if (!isValidIdSessionId) {
    return res.status(422).json({ message: "SessionId is not valid !!" });
  }
  if (!isValidIdCourseId) {
    return res.status(422).json({ message: "CourseId is not valid !!" });
  }

  try {
    const session = await sessionModel
      .findOne({ _id: sessionId })
      .select("-__v")
      .lean();
    if (!session) {
      return res.status(404).json({ message: "Session not found !!" });
    }
    const course = await courseModel
      .findOne({ _id: courseId })
      .populate("sessions", "title time free -courseId")
      .select("-__v")
      .lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found !!" });
    }

    return res.status(200).json({
      session,
      course,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  addSession,
  getSession,
  getSessionAndAllCourseSessions,
  removeSession,
};
