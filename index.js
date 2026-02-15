const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Flutter-dən gələn sorğulara icazə vermək üçün
app.use(express.json());

// Cloudinary Ayarları
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// İmza Yaradan Bölmə (Flutter bura müraciət edəcək)
app.get('/generate-signature', (req, res) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  
  // Cloudinary üçün imza yaradılır
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    // Əgər Flutter-də "folder" istifadə edirsənsə, bura əlavə edə bilərik
  }, process.env.API_SECRET);

  res.json({
    signature: signature,
    timestamp: timestamp,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir.`));