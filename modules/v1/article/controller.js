require("dotenv").config();
const fs = require("fs");
const path = require("path");
const articleModel = require("./model");
const categoryModel = require("./../category/model");
const addArticleValidate = require("../../../utils/validators/articles/addArticle");
const coverValidate = require("../../../utils/validators/articles/cover");
const { isValidObjectId } = require("mongoose");
const {
  checkDBCollectionIndexes,
} = require("../../../utils/checkCollectionIndexes");

const addArticle = async (req, res) => {
  const isValidCover = coverValidate(req);
  if (!isValidCover) {
    return res.status(422).json(coverValidate.errors);
  }

  req.body.publish = +req.body.publish;
  const coverName = req.file.filename;

  const isValidRequestBody = addArticleValidate(req.body);
  if (!isValidRequestBody) {
    fs.unlinkSync(
      path.join(process.cwd(), "public/articles/covers", coverName)
    );
    return res.status(422).json(addArticleValidate.errors);
  }

  const { title, href, categoryId } = req.body;

  const isValidId = isValidObjectId(categoryId);
  if (!isValidId) {
    return res.status(422).json({ message: "CategoryId is not valid !!" });
  }

  try {
    await checkDBCollectionIndexes(articleModel);
  } catch (err) {
    const isArticleExistBefore = await articleModel
      .findOne({
        $or: [{ title }, { href }],
      })
      .lean();
    if (isArticleExistBefore) {
      fs.unlinkSync(
        path.join(process.cwd(), "public/articles/covers", coverName)
      );
      return res.status(422).json({ message: "Article is already exist !!" });
    }
  }

  try {
    const category = await categoryModel.findOne({ _id: categoryId });
    if (!category) {
      fs.unlinkSync(
        path.join(process.cwd(), "public/articles/covers", coverName)
      );
      return res.status(422).json({ message: "Category not found !!" });
    }
    const newArticle = await articleModel.create({
      ...req.body,
      authorId: req.user._id,
      cover: req.file.filename,
    });
    if (!newArticle) {
      return res.status(500).json({ message: "Add Article failed !!" });
    }

    const findedArticle = await articleModel
      .findOne({ _id: newArticle._id })
      .populate("authorId categoryId", "firstname lastname title href")
      .select("-__v")
      .lean();

    return res.status(201).json({
      message: "Article added successfully :))",
      article: findedArticle,
    });
  } catch (error) {
    fs.unlinkSync(
      path.join(process.cwd(), "public/articles/covers", coverName)
    );
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addArticle,
};
