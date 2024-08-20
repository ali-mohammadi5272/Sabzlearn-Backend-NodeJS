const menuModel = require("./model");
const addMenuValidate = require("../../../utils/validators/menus/addMenu");
const updateMenuValidate = require("../../../utils/validators/menus/updateMenu");
const { isValidObjectId } = require("mongoose");
const {
  checkDBCollectionIndexes,
} = require("../../../utils/checkCollectionIndexes");

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
      return res.status(422).json({ message: "Menu is already exist !!" });
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

const removeMenu = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "MenuId is not valid !!" });
  }

  try {
    const menu = await menuModel.findOneAndDelete({ _id: id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found !!" });
    }
    return res.status(200).json({ message: "Menu removed successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateMenu = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "MenuId is not valid !!" });
  }

  const isValidRequestBody = updateMenuValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(updateMenuValidate.errors);
  }

  try {
    const menu = await menuModel.findOneAndUpdate({ _id: id }, req.body);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found !!" });
    }
    const updatedMenu = await menuModel
      .findOne({ _id: menu._id })
      .populate("parent", "title href parent")
      .select("title href parent");

    return res
      .status(200)
      .json({ message: "Menu updated successfully :))", menu: updatedMenu });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMenu,
  getAll,
  removeMenu,
  updateMenu,
};
