const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();


router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(`
            SELECT f.id, f.name, f.description, f.image_url AS image, f.price, f.restaurant_id, f.rating, f.delivery_time
            FROM saved_foods sf
            JOIN foods f ON sf.food_id = f.id
            WHERE sf.user_id = $1
            ORDER BY sf.created_at DESC
        `, [userId]);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Get saved foods error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch saved foods'
        });
    }
});

// @route   POST /api/saved
// @desc    Add food to saved
// @access  Private
router.post('/:foodId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { foodId } = req.params;

        await query(`
            INSERT INTO saved_foods (user_id, food_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [userId, foodId]);

        res.json({
            success: true,
            message: 'Food added to saved items'
        });
    } catch (error) {
        console.error('❌ Add to saved error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add food to saved'
        });
    }
});

// @route   DELETE /api/saved/:foodId
// @desc    Remove food from saved
// @access  Private
router.delete('/:foodId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { foodId } = req.params;

        await query(`
            DELETE FROM saved_foods
            WHERE user_id = $1 AND food_id = $2
        `, [userId, foodId]);

        res.json({
            success: true,
            message: 'Food removed from saved items'
        });
    } catch (error) {
        console.error('❌ Remove from saved error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove food from saved'
        });
    }
});

module.exports = router;
