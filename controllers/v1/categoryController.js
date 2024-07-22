const { default: categoryModel } = require("../../models/category");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");
const {
  default: categoryValidate,
} = require("../../validators/categories/categroy");

const addCategroy = async (req, res) => {
  const isValidRequestBody = categoryValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(categoryValidate.errors);
  }

  const { title, href } = req.body;

  try {
    await checkDBCollectionIndexes(categoryModel);
  } catch (err) {
    const isUserExistBefore = await categoryModel
      .findOne({
        $or: [{ title }, { href }],
      })
      .lean();
    if (isUserExistBefore) {
      return res.status(422).json({ message: "Category is already exist !!" });
    }
  }

  try {
    const newCategory = await categoryModel.create(req.body);
    if (!newCategory) {
      return res.status(500).json({ message: "Add Category failed !!" });
    }

    const newCategoryObject = newCategory.toObject();
    Reflect.deleteProperty(newCategory, "__v");

    return res.status(201).json({
      message: "Category added successfully :))",
      category: newCategoryObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCategroy,
};
