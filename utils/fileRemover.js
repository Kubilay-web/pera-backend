// const fs = require("fs");
// const path = require("path");

// const fileRemover = (filename) => {
//   fs.unlink(path.join(__dirname, "../uploads", filename), function (err) {
//     if (err && err.code === "ENOENT") {
//       // Dosya mevcut değil
//       console.log(`File ${filename} doesn't exist, won't remove it.`);
//     } else if (err) {
//       console.log(err.message);
//       console.log(`Error occurred while trying to remove file ${filename}`);
//     } else {
//       console.log(`removed ${filename}`);
//     }
//   });
// };

// module.exports = { fileRemover };

////////////////////////////////////////////////////////////////////////

const cloudinary = require("cloudinary").v2;

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

// Cloudinary dosya silme işlevi
const fileRemover = (publicId) => {
  cloudinary.uploader.destroy(publicId, function (error, result) {
    if (error) {
      console.log(error.message);
      console.log(
        `Error occurred while trying to remove file with public ID ${publicId}`
      );
    } else {
      console.log(`Removed file with public ID ${publicId}`);
    }
  });
};

module.exports = { fileRemover };
