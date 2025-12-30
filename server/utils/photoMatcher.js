const Photo = require('../models/Photo');

/**
 * Simulate photo matching based on selfie upload
 * In a real implementation, this would use facial recognition AI
 * For now, we return a random subset of event photos
 */
const matchPhotos = async (eventId, selfieFilename) => {
    try {
        // Get all photos for the event
        const allPhotos = await Photo.find({ eventId }).sort({ uploadedAt: -1 });

        if (allPhotos.length === 0) {
            return [];
        }

        // Simulate matching by returning 30-70% of photos randomly
        const matchPercentage = 0.3 + Math.random() * 0.4; // Between 30% and 70%
        const numMatches = Math.max(1, Math.floor(allPhotos.length * matchPercentage));

        // Shuffle and select random photos
        const shuffled = allPhotos.sort(() => 0.5 - Math.random());
        const matched = shuffled.slice(0, numMatches);

        return matched;
    } catch (error) {
        console.error('Photo matching error:', error);
        throw error;
    }
};

module.exports = { matchPhotos };
