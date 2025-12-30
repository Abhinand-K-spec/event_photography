const express = require('express');
const router = express.Router();
const { findPhotos } = require('../controllers/guestController');
const { uploadSelfie } = require('../middleware/upload');

router.post('/find-photos', uploadSelfie.single('selfie'), findPhotos);

module.exports = router;
