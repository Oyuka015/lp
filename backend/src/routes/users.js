const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const userResult = await query(
            'SELECT id, name, email, phone, address, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'User profile not found'
            });
        }

        const user = userResult.rows[0];

        // Get user statistics
        const statsResult = await query(`
            SELECT 
                COUNT(DISTINCT o.id) as order_count,
                COUNT(DISTINCT sf.food_id) as saved_count,
                COALESCE(SUM(o.total_amount), 0) as total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            LEFT JOIN saved_foods sf ON u.id = sf.user_id
            WHERE u.id = $1
            GROUP BY u.id
        `, [userId]);

        const stats = statsResult.rows[0] || { order_count: 0, saved_count: 0, total_spent: 0 };

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    createdAt: user.created_at
                },
                stats: {
                    orderCount: parseInt(stats.order_count),
                    savedCount: parseInt(stats.saved_count),
                    totalSpent: parseFloat(stats.total_spent)
                }
            }
        });

    } catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch profile',
            message: 'An error occurred while fetching user profile'
        });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
    authenticateToken,
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
    body('address').optional().trim().isLength({ max: 500 }).withMessage('Address must be less than 500 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const userId = req.user.id;
        const { name, phone, address } = req.body;

        // Build dynamic update query
        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (name) {
            updates.push(`name = $${paramIndex}`);
            params.push(name);
            paramIndex++;
        }

        if (phone) {
            updates.push(`phone = $${paramIndex}`);
            params.push(phone);
            paramIndex++;
        }

        if (address) {
            updates.push(`address = $${paramIndex}`);
            params.push(address);
            paramIndex++;
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No updates provided',
                message: 'Please provide at least one field to update'
            });
        }

        // Add user ID to params
        params.push(userId);

        const updateQuery = `
            UPDATE users 
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $${paramIndex} 
            RETURNING id, name, email, phone, address, updated_at
        `;

        const result = await query(updateQuery, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'User profile not found'
            });
        }

        const user = result.rows[0];

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                updatedAt: user.updated_at
            }
        });

    } catch (error) {
        console.error('❌ Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Update failed',
            message: 'An error occurred while updating profile'
        });
    }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
    authenticateToken,
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Get current password hash
        const userResult = await query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'User not found'
            });
        }

        const user = userResult.rows[0];

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                error: 'Invalid current password',
                message: 'The current password you provided is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newPasswordHash, userId]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('❌ Change password error:', error);
        res.status(500).json({
            success: false,
            error: 'Password change failed',
            message: 'An error occurred while changing password'
        });
    }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Start transaction
        const client = await require('../config/database').getClient();

        try {
            await client.query('BEGIN');

            // Delete related data (cascade will handle some of this)
            await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
            await client.query('DELETE FROM saved_foods WHERE user_id = $1', [userId]);
            
            // Note: In a real application, you might want to soft delete orders
            // or keep them for business records

            // Delete user
            await client.query('DELETE FROM users WHERE id = $1', [userId]);

            await client.query('COMMIT');

            res.json({
                success: true,
                message: 'Account deleted successfully'
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('❌ Delete account error:', error);
        res.status(500).json({
            success: false,
            error: 'Account deletion failed',
            message: 'An error occurred while deleting your account'
        });
    }
});

module.exports = router;