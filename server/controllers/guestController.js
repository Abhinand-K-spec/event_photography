const Guest = require('../models/Guest');
const Event = require('../models/Event');
const Photo = require('../models/Photo');
const { matchPhotos } = require('../utils/photoMatcher');

// @desc    Find photos by selfie upload
// @route   POST /api/guest/find-photos
// @access  Public
exports.findPhotos = async (req, res) => {
    try {
        const { eventCode } = req.body;

        // Validate event code
        if (!eventCode) {
            return res.status(400).json({
                success: false,
                message: 'Event code is required'
            });
        }

        // Find event
        const event = await Event.findOne({ eventCode });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if selfie was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a selfie'
            });
        }

        // Simulate photo matching
        const matchedPhotos = await matchPhotos(event._id, req.file.filename);

        // Save guest interaction
        const guest = await Guest.create({
            eventId: event._id,
            selfieFilename: req.file.filename,
            matchedPhotos: matchedPhotos.map(p => p._id)
        });

        // Return matched photos
        res.json({
            success: true,
            message: matchedPhotos.length > 0
                ? `Found ${matchedPhotos.length} photos`
                : 'No photos found',
            photos: matchedPhotos.map(photo => ({
                id: photo._id,
                url: `/uploads/photos/${photo.filename}`,
                thumbnail: `/uploads/photos/${photo.filename}`,
                uploadedAt: photo.uploadedAt
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
