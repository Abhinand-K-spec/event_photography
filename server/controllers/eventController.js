const Event = require('../models/Event');
const Photo = require('../models/Photo');
const { generateQRCode } = require('../utils/qrGenerator');
const crypto = require('crypto');

// Generate unique event code
const generateEventCode = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @desc    Get all events for photographer
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ photographerId: req.photographer._id })
            .sort({ createdAt: -1 });

        // Get photo count for each event
        const eventsWithCounts = await Promise.all(
            events.map(async (event) => {
                const photoCount = await Photo.countDocuments({ eventId: event._id });
                return {
                    id: event._id,
                    name: event.name,
                    date: event.date,
                    eventCode: event.eventCode,
                    qrCodePath: event.qrCodePath,
                    isActive: event.isActive,
                    photoCount,
                    createdAt: event.createdAt
                };
            })
        );

        res.json({
            success: true,
            events: eventsWithCounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
    try {
        const { name, date } = req.body;

        // Validate input
        if (!name || !date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide event name and date'
            });
        }

        // Generate unique event code
        let eventCode;
        let codeExists = true;
        while (codeExists) {
            eventCode = generateEventCode();
            const existing = await Event.findOne({ eventCode });
            if (!existing) codeExists = false;
        }

        // Generate QR code
        const qrData = await generateQRCode(eventCode);

        // Create event
        const event = await Event.create({
            name,
            date,
            photographerId: req.photographer._id,
            eventCode,
            qrCodePath: `/uploads/qrcodes/${qrData.filename}` // Store URL path, not file system path
        });

        res.status(201).json({
            success: true,
            event: {
                id: event._id,
                name: event.name,
                date: event.date,
                eventCode: event.eventCode,
                qrCodeUrl: `/uploads/qrcodes/${qrData.filename}`,
                eventUrl: qrData.url,
                createdAt: event.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get event by code (public for guests)
// @route   GET /api/events/:eventCode
// @access  Public
exports.getEventByCode = async (req, res) => {
    try {
        const event = await Event.findOne({ eventCode: req.params.eventCode });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            event: {
                id: event._id,
                name: event.name,
                date: event.date,
                eventCode: event.eventCode
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check ownership
        if (event.photographerId.toString() !== req.photographer._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        // Delete associated photos
        await Photo.deleteMany({ eventId: event._id });

        // Delete event
        await event.deleteOne();

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
