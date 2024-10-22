const express = require("express");
const router = express.Router();

const {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} = require("../controllers/commentControllers");

const { adminGuard, authGuard } = require("../middleware/authMiddleware");

// Yorumlar için yönlendirme
router
  .route("/")
  .post(authGuard, createComment) // Yorum oluştur
  .get(authGuard, adminGuard, getAllComments); // Tüm yorumları getir

router
  .route("/:commentId")
  .put(authGuard, updateComment) // Yorum güncelle
  .delete(authGuard, deleteComment); // Yorum sil

// CommonJS modül sistemi için export
module.exports = router;
