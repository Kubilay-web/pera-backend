const Post = require("../models/Post");

const searchArticles = async (req, res) => {
  const { searchKeyword } = req.body;

  try {
    const results = await Post.find({
      $or: [
        { title: { $regex: searchKeyword, $options: "i" } },
        { caption: { $regex: searchKeyword, $options: "i" } },
      ],
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.json({ results });
  } catch (error) {
    console.error("Arama sırasında hata oluştu:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchArticles };
