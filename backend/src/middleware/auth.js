const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// JWT Secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Verify JWT Token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: 'Access token required',
                message: 'Please provide a valid authentication token'
            });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(403).json({
                error: 'Invalid token',
                message: 'The provided token is invalid or expired'
            });
        }

        // Check if user still exists
        const userResult = await query(
            'SELECT id, name, email, phone, address FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
                message: 'The user associated with this token no longer exists'
            });
        }

        req.user = userResult.rows[0];
        next();
    } catch (error) {
        console.error('❌ Authentication error:', error);
        return res.status(500).json({
            error: 'Authentication failed',
            message: 'An error occurred during authentication'
        });
    }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = verifyToken(token);
            if (decoded) {
                const userResult = await query(
                    'SELECT id, name, email FROM users WHERE id = $1',
                    [decoded.userId]
                );
                if (userResult.rows.length > 0) {
                    req.user = userResult.rows[0];
                }
            }
        }
        next();
    } catch (error) {
        // Don't fail the request, just continue without user
        next();
    }
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    optionalAuth
};