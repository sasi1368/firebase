const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path'); // برای استفاده از مسیریابی

// راه‌اندازی Firebase Admin SDK با استفاده از کلید سرویس
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// استفاده از body-parser برای پردازش داده‌ها
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// مسیریابی برای فایل HTML (صفحه ورود)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // مسیر به فایل HTML
});

// نقطه‌ورود برای تایید هویت با شماره تلفن (بررسی OTP)
app.post('/verify-phone', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // تایید OTP با استفاده از Firebase Admin SDK
    const verificationResult = await admin.auth().verifyIdToken(otp);

    // ارسال موفقیت‌آمیز
    res.status(200).send({ message: 'ورود با موفقیت انجام شد!', user: verificationResult });
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(400).send({ message: 'خطا در تایید هویت!' });
  }
});

// شروع سرور
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
