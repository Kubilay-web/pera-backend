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

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

// Cloudinary storage yapılandırması
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog-app", // Cloudinary'de kaydedilecek klasör
    format: async (req, file) => "png", // Dosya formatı (isteğe bağlı)
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Dosya ismi
  },
});

// Multer ile Cloudinary storage kullanımı
const uploadPicture = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1000000, // Maksimum dosya boyutu 1MB
  },
  fileFilter: function (req, file, cb) {
    let ext = file.mimetype;
    if (ext !== "image/png" && ext !== "image/jpg" && ext !== "image/jpeg") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// CommonJS modül sistemi için export
module.exports = { uploadPicture };
