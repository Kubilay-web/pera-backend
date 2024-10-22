const { uploadPicture } = require("../middleware/uploadPictureMiddleware");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { fileRemover } = require("../utils/fileRemover");
const { v4: uuidv4 } = require("uuid");

const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "sample title",
      caption: "sample caption",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      user: req.user._id,
    });

    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post was not found");
      next(error);
      return;
    }

    const upload = uploadPicture.single("postPicture");

    const handleUpdatePostData = async (data) => {
      const { title, caption, slug, body, tags, categories } = JSON.parse(data);
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.categories = categories || post.categories;
      const updatedPost = await post.save();
      return res.json(updatedPost);
    };

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occurred when uploading " + err.message
        );
        next(error);
      } else {
        // Everything went well
        if (req.file) {
          let filename;
          filename = post.photo;
          if (filename) {
            fileRemover(filename);
          }
          post.photo = req.file.filename;
          await handleUpdatePostData(req.body.document); // await ekleyin
        } else {
          let filename;
          filename = post.photo;
          post.photo = "";
          fileRemover(filename);
          await handleUpdatePostData(req.body.document); // await ekleyin
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    fileRemover(post.photo);

    await Comment.deleteMany({ post: post._id });

    return res.json({
      message: "Post is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "categories",
        select: ["title"],
      },
      {
        path: "comments",
        match: {
          check: true,
          parent: null,
        },
        populate: [
          {
            path: "user",
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            match: {
              check: true,
            },
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
              },
            ],
          },
        ],
      },
    ]);

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
};

// const getAllPosts = async (req, res, next) => {
//   try {
//     const filter = req.query.searchKeyword;
//     const categories = req.query.categories
//       ? req.query.categories.split(",")
//       : []; // Expecting categories to be comma-separated

//     let where = {};

//     if (filter) {
//       where.title = { $regex: filter, $options: "i" };
//     }

//     if (categories.length > 0) {
//       where.categories = { $in: categories };
//     }

//     let query = Post.find(where);
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * pageSize;
//     const total = await Post.find(where).countDocuments();
//     const pages = Math.ceil(total / pageSize);

//     res.header({
//       "x-filter": filter,
//       "x-totalcount": JSON.stringify(total),
//       "x-currentpage": JSON.stringify(page),
//       "x-pagesize": JSON.stringify(pageSize),
//       "x-totalpagecount": JSON.stringify(pages),
//     });

//     if (page > pages) {
//       return res.json([]);
//     }

//     const result = await query
//       .skip(skip)
//       .limit(pageSize)
//       .populate([
//         {
//           path: "user",
//           select: ["avatar", "name", "verified"],
//         },
//         {
//           path: "categories",
//           select: ["title"],
//         },
//       ])
//       .sort({ updatedAt: "desc" });

//     return res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };

const getAllPosts = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    const categories = req.query.categories
      ? req.query.categories.split(",")
      : []; // Expecting categories to be comma-separated

    let where = {};

    // `filter` ile hem `title` hem de `caption` alanında arama yapılır
    if (filter) {
      where.$or = [
        { title: { $regex: filter, $options: "i" } },
        { caption: { $regex: filter, $options: "i" } },
      ];
    }

    if (categories.length > 0) {
      where.categories = { $in: categories };
    }

    let query = Post.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Post.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]); // Eğer sayfa mevcut değilse boş döndür
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
        {
          path: "categories",
          select: ["title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

// CommonJS modül sistemi için export
module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
};