const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp'],
  params: {
    folder: 'E-Commerce'
  }
});

module.exports.uploadCloud = multer({ storage });
