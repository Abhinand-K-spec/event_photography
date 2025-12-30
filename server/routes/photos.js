const express = require('express');
const router = express.Router();
const {
    uploadPhotos,
    getEventPhotos,
    downloadPhoto
} = require('../controllers/photoController');
const { protect } = require('../middleware/auth');
const { uploadPhotos: uploadMiddleware } = require('../middleware/upload');

router.post('/upload/:eventId', protect, uploadMiddleware.array('photos', 50), uploadPhotos);
router.get('/:eventId', protect, getEventPhotos);
router.get('/download/:photoId', downloadPhoto);

module.exports = router;
