const notificationModel = require("../../models/notification");
const userModel = require("../../models/user");
const notificationValidate = require("../../validators/notification/sendNotification");
const { roles } = require("../../utils/constants");

const sendNotification = async (req, res) => {
  const isValidRequestBody = notificationValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(notificationValidate.errors);
  }

  const notificationCreator = JSON.parse(JSON.stringify(req.user._id));
  if (notificationCreator === req.body.adminId) {
    return res
      .status(422)
      .json({ message: "You can't send notification to yourself !!" });
  }

  try {
    const user = await userModel.findOne({
      _id: req.body.adminId,
      role: { $ne: roles.user },
    });
    if (!user) {
      return res
        .status(422)
        .json({ message: "User not found or User's Role is User !!" });
    }

    const newNotification = await notificationModel.create(req.body);
    if (!newNotification) {
      return res.status(500).json({ message: "Add Notification failed !!" });
    }

    const newNotificationObject = newNotification.toObject();
    Reflect.deleteProperty(newNotificationObject, "__v");

    return res.status(201).json({
      message: "Notification added successfully :))",
      notification: newNotificationObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getNotificationsByAdmin = async (req, res) => {
  if (req.user.role === roles.manager) {
    return res
      .status(422)
      .json({
        message:
          "You have not any Notification, because you are Manager and no one can't send Notifications to you !!",
      });
  }
  try {
    const notifications = await notificationModel
      .find({ adminId: req.user._id })
      .select("-__v")
      .lean();
    if (!notifications) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { sendNotification, getNotificationsByAdmin };
