const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Gönderi Şeması
const PostSchema = new Schema(
  {
    title: { type: String, required: true }, // Başlık
    caption: { type: String, required: true }, // Alt başlık
    slug: { type: String, required: true, unique: true }, // URL dostu başlık
    body: { type: Object, required: true }, // Gönderinin içeriği
    photo: { type: String, required: false }, // Gönderinin görseli
    user: { type: Schema.Types.ObjectId, ref: "User" }, // Gönderiyi yapan kullanıcı
    tags: { type: [String] }, // Gönderi etiketleri
    categories: [{ type: Schema.Types.ObjectId, ref: "PostCategories" }], // Kategori referansları
  },
  { timestamps: true, toJSON: { virtuals: true } } // Oluşturulma ve güncellenme tarihleri
);

// Yorumları sanal alan olarak tanımlama
PostSchema.virtual("comments", {
  ref: "Comment", // Yorum modeline referans
  localField: "_id", // Gönderi ID'si
  foreignField: "post", // Yorumun ait olduğu gönderi
});

// Gönderi Modeli
const Post = model("Post", PostSchema);

// CommonJS modül sistemi için export
module.exports = Post;
