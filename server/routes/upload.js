const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const User = require('../models/User');

/**
 * POST /api/upload/avatar
 * Protected — requires valid JWT cookie or Authorization header.
 * Accepts multipart/form-data with field name "avatar".
 * Uploads to Cloudinary, saves URL to user.avatar, returns updated URL.
 */
router.post(
  '/avatar',
  protect,
  // multer middleware: single file under field name "avatar"
  upload.single('avatar'),
  async (req, res) => {
    try {
      // multer-storage-cloudinary attaches the Cloudinary result to req.file
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // req.file.path is the secure Cloudinary URL when using CloudinaryStorage
      const avatarUrl = req.file.path;

      // Persist the URL on the authenticated user's document
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: avatarUrl },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ success: true, avatar: user.avatar });
    } catch (err) {
      console.error('[upload/avatar]', err.message);
      res.status(500).json({ message: err.message || 'Upload failed' });
    }
  }
);

// Multer error handler — catches file size and type rejections
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 5 MB.' });
  }
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
