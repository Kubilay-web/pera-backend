const express = require("express");
const router = express.Router();

const {
  createPostCategory,
  deletePostCategory,
  getAllPostCategories,
  updatePostCategory,
  getSingleCategory,
} = require("../controllers/postCategoriesController");

const { adminGuard, authGuard } = require("../middleware/authMiddleware");

// Post kategorileri için yönlendirme
router
  .route("/")
  .post(authGuard, adminGuard, createPostCategory) // Kategori oluştur
  .get(getAllPostCategories); // Tüm kategorileri getir

router
  .route("/:postCategoryId")
  .get(getSingleCategory) // Belirli bir kategoriyi getir
  .put(authGuard, adminGuard, updatePostCategory) // Kategoriyi güncelle
  .delete(authGuard, adminGuard, deletePostCategory); // Kategoriyi sil

// CommonJS modül sistemi için export
module.exports = router;
