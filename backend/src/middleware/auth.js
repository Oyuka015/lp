import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

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
        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'Authentication failed',
            message: 'An error occurred during authentication'
        });
    }
};

export const optionalAuth = async (req, res, next) => {
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
        next();
    }
};


export default {
    generateToken,
    verifyToken,
    authenticateToken,
    optionalAuth
};