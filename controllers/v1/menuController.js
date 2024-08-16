const menuModel = require("../../models/menu");
const addMenuValidate = require("../../validators/menus/addMenu");
const { isValidObjectId } = require("mongoose");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");

const addMenu = async (req, res) => {
  const isValidRequestBody = addMenuValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(addMenuValidate.errors);
  }

  const { title, href } = req.body;

  try {
    await checkDBCollectionIndexes(menuModel);
  } catch (err) {
    const isMenuExistBefore = await menuModel
      .findOne({
        $or: [{ title }, { href }],
      })
      .lean();
    if (isMenuExistBefore) {
      return res.status(422).json({ message: "Category is already exist !!" });
    }
  }

  try {
    const newMenu = await menuModel.create(req.body);
    if (!newMenu) {
      return res.status(500).json({ message: "Add Menu failed !!" });
    }

    const newMenuObject = newMenu.toObject();
    Reflect.deleteProperty(newMenuObject, "__v");

    return res.status(201).json({
      message: "Menu added successfully :))",
      menu: newMenuObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const menus = await menuModel
      .find({ parent: null })
      .populate("subMenus", "title href -parent")
      .select("title href")
      .lean();
    if (!menus) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(menus);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMenu,
  getAll,
};
