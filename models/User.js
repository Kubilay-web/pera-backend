const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bcrypt = require("bcryptjs");
const { hash, compare } = bcrypt;

const jwt = require("jsonwebtoken");
const { sign } = jwt;

// Kullanıcı Şeması
const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" }, // Kullanıcı avatarı
    name: { type: String, required: true }, // Kullanıcı adı
    email: { type: String, required: true, unique: true }, // Kullanıcı e-posta adresi
    password: { type: String, required: true }, // Kullanıcı şifresi
    verified: { type: Boolean, default: false }, // Hesap doğrulama durumu
    verificationCode: { type: String, required: false }, // Doğrulama kodu
    admin: { type: Boolean, default: false }, // Yönetici durumu
  },
  { timestamps: true } // Oluşturulma ve güncellenme tarihleri
);

// Şifre kaydedilmeden önce hashleme işlemi
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});

// JWT oluşturma metodu
UserSchema.methods.generateJWT = async function () {
  return await sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // 30 gün geçerlilik süresi
  });
};

// Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

// Kullanıcı Modeli
const User = model("User", UserSchema);

// CommonJS modül sistemi için export
module.exports = User;
