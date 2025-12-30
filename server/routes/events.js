const express = require('express');
const router = express.Router();
const {
    getEvents,
    createEvent,
    getEventByCode,
    deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getEvents);
router.post('/', protect, createEvent);
router.get('/:eventCode', getEventByCode);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
