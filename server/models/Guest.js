const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    selfieFilename: {
        type: String
    },
    matchedPhotos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo'
    }],
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for event lookups
guestSchema.index({ eventId: 1, uploadedAt: -1 });

module.exports = mongoose.model('Guest', guestSchema);
