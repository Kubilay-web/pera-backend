const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Gönderi Kategorileri Şeması
const PostCategoriesSchema = new Schema(
  {
    title: { type: String, required: true }, // Kategori başlığı
  },
  { timestamps: true } // Oluşturulma ve güncellenme tarihleri
);

// Gönderi Kategorileri Modeli
const PostCategories = model("PostCategories", PostCategoriesSchema);

// CommonJS modül sistemi için export
module.exports = PostCategories;
