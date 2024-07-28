const { default: sessionModel } = require("../../models/session");
const { isValidObjectId } = require("mongoose");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const {
  default: sessionValidate,
} = require("../../validators/sessions/session");


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

module.exports = { getAll, addSession, getSession };
