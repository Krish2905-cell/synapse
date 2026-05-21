const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage engine for multer
// Uploads directly to Cloudinary — no local disk writes
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'synapse/avatars',       // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' }, // Square crop, face-aware
      { quality: 'auto', fetch_format: 'auto' },                   // Auto optimize
    ],
  },
});

// File filter — reject anything that isn't an image
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png, and webp images are allowed'), false);
  }
};

// Multer instance: 5 MB limit, Cloudinary storage
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = { cloudinary, upload };
