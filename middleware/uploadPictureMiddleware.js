// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const uploadPicture = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1 * 1000000,
//   },
//   fileFilter: function (req, file, cb) {
//     let ext = path.extname(file.originalname);
//     if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
//       return cb(new Error("Only images are allowed"));
//     }
//     cb(null, true);
//   },
// });

// module.exports = { uploadPicture };

////////////////////////////////////////////////////////

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage ayarları
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog-app", // Cloudinary'deki klasör adı
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// multer'ı CloudinaryStorage ile kullan
const uploadPicture = multer({ storage: storage });

module.exports = { uploadPicture };
