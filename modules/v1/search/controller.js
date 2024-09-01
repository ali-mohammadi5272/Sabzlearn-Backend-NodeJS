const courseModel = require("./../course/model");

const globalSearch = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword.trim()) {
    return res.status(400).json({ message: "Invalid keyword !!" });
  }

  try {
    const courses = await courseModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { shortDescription: { $regex: keyword, $options: "i" } },
          { longDescription: { $regex: keyword, $options: "i" } },
        ],
      })
      .lean();

    const articles = await articleModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { body: { $regex: keyword, $options: "i" } },
        ],
      })
      .populate("authorId", "firstname lastname")
      .populate("categoryId", "title")
      .select("-__v")
      .lean();

    return res.status(200).json([...courses, ...articles]);
  } catch (error) {
    return res.json({ message: error.message });
  }
};

module.exports = { globalSearch };
