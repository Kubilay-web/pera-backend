const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
} = require("../controllers/userControllers");

const { adminGuard, authGuard } = require("../middleware/authMiddleware");

// Kullanıcı yönlendirme
router.post("/register", registerUser); // Yeni kullanıcı kaydı
router.post("/login", loginUser); // Kullanıcı girişi
router.get("/profile", authGuard, userProfile); // Kullanıcı profili
router.put("/updateProfile/:userId", authGuard, updateProfile); // Kullanıcı profili güncelle
router.put("/updateProfilePicture", authGuard, updateProfilePicture); // Profil resmi güncelle
router.get("/", authGuard, adminGuard, getAllUsers); // Tüm kullanıcıları getir
router.delete("/:userId", authGuard, adminGuard, deleteUser); // Kullanıcı sil

// CommonJS modül sistemi için export
module.exports = router;
