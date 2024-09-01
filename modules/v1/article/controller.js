require("dotenv").config();
const fs = require("fs");
const path = require("path");
const articleModel = require("./model");
const categoryModel = require("./../category/model");
const addArticleValidate = require("../../../utils/validators/articles/addArticle");
const updateArticleValidate = require("../../../utils/validators/articles/updateArticle");
const coverValidate = require("../../../utils/validators/articles/cover");
const { roles } = require("../../../utils/constants");
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
    if ("file" in req) {
      fs.unlinkSync(
        path.join(process.cwd(), "public/articles/covers", coverName)
      );
    }
    return res.status(500).json({ message: error.message });
  }
};

const removeArticle = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "ArticleId is not valid !!" });
  }

  try {
    const article = await articleModel.findOneAndDelete({ _id: id });
    if (!article) {
      return res.status(404).json({ message: "Article not found !!" });
    }
    return res
      .status(200)
      .json({ message: "Article removed successfully :))" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const menus = await articleModel
      .find({})
      .populate("authorId", "firstname lastname")
      .populate("categoryId", "title")
      .select("-__v")
      .lean();
    if (!menus) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(menus);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getArticle = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "ArticleId is not valid !!" });
  }

  try {
    const article = await articleModel
      .findOne({ _id: id })
      .populate("authorId", "firstname lastname")
      .populate("categoryId", "title")
      .select("-__v")
      .lean();
    if (!article) {
      return res.status(404).json({ message: "Article not found !!" });
    }
    return res.status(200).json(article);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(422).json({ message: "ArticleId is not valid !!" });
  }

  try {
    const article = await articleModel
      .findOne({ _id: id })
      .populate("authorId", "firstname lastname")
      .populate("categoryId", "title")
      .select("-__v")
      .lean();

    const isUserCanEditArticle =
      req.user._id === article.authorId ||
      req.user.role === roles.manager ||
      req.user.role === roles.admin;
    if (!isUserCanEditArticle) {
      return res.status(403).json({
        message:
          "You cannot edit this article because you are not the author !!",
      });
    }

    req.body.publish = +req.body.publish;

    const isValidRequestBody = updateArticleValidate(req.body);
    if (!isValidRequestBody) {
      if ("file" in req) {
        fs.unlinkSync(
          path.join(process.cwd(), "public/articles/covers", req.file.filename)
        );
      }
      return res.status(422).json(updateArticleValidate.errors);
    }

    const { categoryId } = req.body;

    const isCategoryIdChanged =
      categoryId === article.categoryId._id.toString();
    if (!isCategoryIdChanged) {
      const isValidCategoryId = isValidObjectId(categoryId);
      if (!isValidCategoryId) {
        return res.status(422).json({ message: "CategoryId is not valid !!" });
      }

      const category = await categoryModel.findOne({ _id: categoryId });
      if (!category) {
        if ("file" in req) {
          fs.unlinkSync(
            path.join(
              process.cwd(),
              "public/articles/covers",
              req.file.filename
            )
          );
        }
        return res.status(422).json({ message: "Category not found !!" });
      }
    }

    const updatedArticle = await articleModel
      .findOneAndUpdate(
        { _id: id },
        {
          ...article,
          ...req.body,
          cover: "file" in req ? req.file.filename : article.cover,
          authorId: article.authorId,
        }
      )
      .populate("authorId", "firstname lastname")
      .populate("categoryId", "title")
      .select("-__v")
      .lean();

    if ("file" in req) {
      fs.unlinkSync(
        path.join(process.cwd(), "public/articles/covers", article.cover)
      );
    }

    return res.status(200).json({
      message: "Article updated successfully :))",
      article: {
        ...updatedArticle,
        ...req.body,
        cover: "file" in req ? req.file.filename : article.cover,
        authorId: article.authorId,
      },
    });
  } catch (error) {
    if ("file" in req) {
      fs.unlinkSync(
        path.join(process.cwd(), "public/articles/covers", req.file.filename)
      );
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addArticle,
  removeArticle,
  getAll,
  getArticle,
  updateArticle,
};
