const courseModel = require("../../models/course");

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

    //articles ...
    // return res.status(200).json([...courses, ...articles]);

    return res.status(200).json(courses);
  } catch (error) {
    return res.json({ message: error.message });
  }
};

module.exports = { globalSearch };
