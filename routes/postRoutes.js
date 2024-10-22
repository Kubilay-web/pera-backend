const express = require("express");
const router = express.Router();

const {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} = require("../controllers/postControllers");

const { authGuard, adminGuard } = require("../middleware/authMiddleware");

// Postlar için yönlendirme
router
  .route("/")
  .post(authGuard, adminGuard, createPost) // Yeni post oluştur
  .get(getAllPosts); // Tüm postları getir

router
  .route("/:slug")
  .get(getPost) // Belirli bir postu getir
  .put(authGuard, adminGuard, updatePost) // Postu güncelle
  .delete(authGuard, adminGuard, deletePost); // Postu sil

// CommonJS modül sistemi için export
module.exports = router;
