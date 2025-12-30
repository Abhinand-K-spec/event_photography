const Photo = require('../models/Photo');
const Event = require('../models/Event');
const path = require('path');

// @desc    Upload photos to event
// @route   POST /api/photos/upload/:eventId
// @access  Private
exports.uploadPhotos = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Verify event exists and belongs to photographer
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.photographerId.toString() !== req.photographer._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload to this event'
            });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No photos uploaded'
            });
        }

        // Save photo metadata to database
        const photoPromises = req.files.map(file => {
            return Photo.create({
                eventId,
                filename: file.filename,
                filepath: file.path,
                size: file.size,
                mimetype: file.mimetype
            });
        });

        const photos = await Promise.all(photoPromises);

        res.status(201).json({
            success: true,
            uploadedCount: photos.length,
            photos: photos.map(photo => ({
                id: photo._id,
                filename: photo.filename,
                url: `/uploads/photos/${photo.filename}`,
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

// @desc    Get all photos for an event
// @route   GET /api/photos/:eventId
// @access  Private
exports.getEventPhotos = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Verify event belongs to photographer
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.photographerId.toString() !== req.photographer._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these photos'
            });
        }

        const photos = await Photo.find({ eventId }).sort({ uploadedAt: -1 });

        res.json({
            success: true,
            photos: photos.map(photo => ({
                id: photo._id,
                filename: photo.filename,
                url: `/uploads/photos/${photo.filename}`,
                size: photo.size,
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

// @desc    Download photo
// @route   GET /api/photos/download/:photoId
// @access  Public
exports.downloadPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        // Send file
        res.download(photo.filepath, photo.filename);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
