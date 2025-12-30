const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    size: {
        type: Number
    },
    mimetype: {
        type: String
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster event photo queries
photoSchema.index({ eventId: 1, uploadedAt: -1 });

module.exports = mongoose.model('Photo', photoSchema);
