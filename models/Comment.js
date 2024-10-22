const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Yorum Şeması
const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Yorum yapan kullanıcı
    desc: { type: String, required: true }, // Yorumun içeriği
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // Yorumun ait olduğu gönderi
    check: { type: Boolean, default: false }, // Yorumun onay durumu
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // Ana yorum (eğer yanıt ise)
    },
    replyOnUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // Yanıtlanan kullanıcı
    },
  },
  { timestamps: true, toJSON: { virtuals: true } } // Oluşturulma ve güncellenme tarihleri
);

// Yanıtları sanal alan olarak tanımlama
CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
});

// Yorum Modeli
const Comment = model("Comment", CommentSchema);

// CommonJS modül sistemi için export
module.exports = Comment;
