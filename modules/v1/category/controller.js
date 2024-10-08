const { isValidObjectId } = require("mongoose");
const categoryModel = require("./model");
const categoryValidate = require("../../../utils/validators/categories/categroy");
const {
  checkDBCollectionIndexes,
} = require("../../../utils/checkCollectionIndexes");

const addCategroy = async (req, res) => {
  const isValidRequestBody = categoryValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(categoryValidate.errors);
  }

  const { title, href } = req.body;

  try {
    await checkDBCollectionIndexes(categoryModel);
  } catch (err) {
    const isCategoryExistBefore = await categoryModel
      .findOne({
        $or: [{ title }, { href }],
      })
      .lean();
    if (isCategoryExistBefore) {
      return res.status(422).json({ message: "Category is already exist !!" });
    }
  }

  try {
    const newCategory = await categoryModel.create(req.body);
    if (!newCategory) {
      return res.status(500).json({ message: "Add Category failed !!" });
    }

    const newCategoryObject = newCategory.toObject();
    Reflect.deleteProperty(newCategoryObject, "__v");

    return res.status(201).json({
      message: "Category added successfully :))",
      category: newCategoryObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await categoryModel.find({}).select("-__v").lean();
    if (!categories) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "CategoryId is not valid !!" });
  }

  try {
    const category = await categoryModel
      .findOne({ _id: id })
      .select("-__v")
      .lean();
    if (!category) {
      return res.status(404).json({ message: "Categroy not found !!" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeCategory = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "CategoryId is not valid !!" });
  }

  try {
    const category = await categoryModel.findOneAndDelete({ _id: id });
    if (!category) {
      return res.status(404).json({ message: "Categroy not found !!" });
    }
    return res
      .status(200)
      .json({ message: "Category removed successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "CategoryId is not valid !!" });
  }

  const isValidRequestBody = categoryValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(categoryValidate.errors);
  }

  try {
    const category = await categoryModel.findOneAndUpdate(
      { _id: id },
      req.body
    );
    if (!category) {
      return res.status(404).json({ message: "Categroy not found !!" });
    }
    return res
      .status(200)
      .json({ message: "Category updated successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCategroy,
  getAll,
  getCategory,
  removeCategory,
  updateCategory,
};
