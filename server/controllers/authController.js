const Photographer = require('../models/Photographer');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new photographer
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if photographer exists
        const photographerExists = await Photographer.findOne({ email });
        if (photographerExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create photographer
        const photographer = await Photographer.create({
            name,
            email,
            password
        });

        // Generate token
        const token = generateToken(photographer._id);

        res.status(201).json({
            success: true,
            token,
            photographer: {
                id: photographer._id,
                name: photographer.name,
                email: photographer.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login photographer
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find photographer with password
        const photographer = await Photographer.findOne({ email }).select('+password');
        if (!photographer) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await photographer.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(photographer._id);

        res.json({
            success: true,
            token,
            photographer: {
                id: photographer._id,
                name: photographer.name,
                email: photographer.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current photographer
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const photographer = await Photographer.findById(req.photographer._id);

        res.json({
            success: true,
            photographer: {
                id: photographer._id,
                name: photographer.name,
                email: photographer.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
