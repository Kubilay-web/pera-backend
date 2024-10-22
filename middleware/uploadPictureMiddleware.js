const multer = require("multer");
const path = require("path");

// Depolama ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Yüklenen dosyaların kaydedileceği dizin
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Dosya adı, tarih ve orijinal adı içerecek şekilde ayarlanıyor
  },
});

// Yükleme yapılandırması
const uploadPicture = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1000000, // Maksimum dosya boyutu 1MB
  },
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Only images are allowed")); // Sadece PNG, JPG ve JPEG dosyalarına izin veriliyor
    }
    cb(null, true); // Dosya geçerli
  },
});

// CommonJS modül sistemi için export
module.exports = { uploadPicture };
