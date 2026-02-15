const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

app.get('/generate-signature', (req, res) => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  const public_id = req.query.public_id; // Flutter-dən gələn fayl adı

  // İmzalanacaq bütün parametrləri bura yığırıq
  const paramsToSign = {
    timestamp: timestamp,
    overwrite: true
  };

  if (public_id) {
    paramsToSign.public_id = public_id;
  }

  // Cloudinary bu parametrlərə əsasən imza yaradır
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.API_SECRET);

  res.json({ timestamp, signature });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir...`);
});