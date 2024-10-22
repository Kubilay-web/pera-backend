const Subscriber = require("../models/Subscriber");
const mailchimp = require("@mailchimp/mailchimp_transactional");

// Mailchimp API anahtarınızı burada tanımlayın
const mailchimpClient = mailchimp("54e844adb989a0cd57446bd61d1f96b0-us13");

// E-posta aboneliği oluşturma fonksiyonu
const subscribe = async (req, res) => {
  const { email } = req.body;

  try {
    // E-posta adresinin daha önce kaydedilip kaydedilmediğini kontrol et
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "Bu e-posta zaten abone." });
    }

    // Yeni abonelik oluştur
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Mailchimp üzerinden onay e-postası gönderme
    try {
      const response = await mailchimpClient.messages.send({
        message: {
          from_email: "kubilayozdemir95@gmail.com", // Gönderen e-posta adresi
          subject: "Thank you for subscribing!",
          text: `Hi, thank you for subscribing to our newsletter!`,
          to: [{ email }], // Abone olan kullanıcının e-postası
        },
      });
      console.log("Confirmation email sent:", response);
    } catch (error) {
      console.error("Error sending email:", error.message);
      // Mail gönderimi başarısız olursa, bu durumu yönetebilirsiniz.
      // İsterseniz kullanıcıya burada bir hata mesajı dönebilirsiniz
      return res
        .status(500)
        .json({ message: "E-posta gönderimi sırasında bir hata oluştu." });
    }

    res.status(201).json({ message: "Abone olundu!" });
  } catch (error) {
    console.error("Abonelik hatası:", error);
    res
      .status(500)
      .json({ message: "Abonelik oluşturulurken bir hata oluştu." });
  }
};

module.exports = { subscribe };
