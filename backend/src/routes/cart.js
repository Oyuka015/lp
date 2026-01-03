const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(`
            SELECT 
                ci.food_id as id,
                ci.quantity,
                f.name,
                f.description,
                f.price,
                f.image_url,
                f.rating,
                f.delivery_time,
                r.name as restaurant_name
            FROM cart_items ci
            JOIN foods f ON ci.food_id = f.id
            LEFT JOIN restaurants r ON f.restaurant_id = r.id
            WHERE ci.user_id = $1
            ORDER BY ci.added_at DESC
        `, [userId]);

        const cartItems = result.rows.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            image: item.image_url,
            quantity: item.quantity,
            rating: parseFloat(item.rating),
            deliveryTime: item.delivery_time,
            restaurant: item.restaurant_name
        }));

        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({
            success: true,
            data: {
                items: cartItems,
                total: parseFloat(total.toFixed(2)),
                itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
            }
        });

    } catch (error) {
        console.error('❌ Get cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cart',
            message: 'An error occurred while fetching your cart'
        });
    }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', [
    authenticateToken,
    body('foodId').isUUID().withMessage('Valid food ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

        const { foodId, quantity = 1 } = req.body;
        const userId = req.user.id;

        // Check if food exists
        const foodResult = await query('SELECT id, price FROM foods WHERE id = $1', [foodId]);
        if (foodResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Food not found',
                message: 'The food item you are trying to add was not found'
            });
        }

        // Check if item already in cart
        const existingResult = await query(
            'SELECT quantity FROM cart_items WHERE user_id = $1 AND food_id = $2',
            [userId, foodId]
        );

        if (existingResult.rows.length > 0) {
            // Update quantity
            const newQuantity = existingResult.rows[0].quantity + quantity;
            await query(
                'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND food_id = $3',
                [newQuantity, userId, foodId]
            );
        } else {
            // Add new item
            await query(
                'INSERT INTO cart_items (user_id, food_id, quantity) VALUES ($1, $2, $3)',
                [userId, foodId, quantity]
            );
        }

        res.json({
            success: true,
            message: 'Item added to cart',
            foodId
        });

    } catch (error) {
        console.error('❌ Add to cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add to cart',
            message: 'An error occurred while adding item to cart'
        });
    }
});

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/update', [
    authenticateToken,
    body('foodId').isUUID().withMessage('Valid food ID is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
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

        const { foodId, quantity } = req.body;
        const userId = req.user.id;

        if (quantity === 0) {
            // Remove from cart
            await query(
                'DELETE FROM cart_items WHERE user_id = $1 AND food_id = $2',
                [userId, foodId]
            );
            
            res.json({
                success: true,
                message: 'Item removed from cart',
                action: 'removed'
            });
        } else {
            // Update quantity
            const result = await query(
                'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND food_id = $3 RETURNING *',
                [quantity, userId, foodId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Item not found in cart',
                    message: 'The item you are trying to update is not in your cart'
                });
            }

            res.json({
                success: true,
                message: 'Cart updated',
                action: 'updated',
                foodId,
                quantity
            });
        }

    } catch (error) {
        console.error('❌ Update cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update cart',
            message: 'An error occurred while updating cart'
        });
    }
});

// @route   DELETE /api/cart/remove/:foodId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:foodId', authenticateToken, async (req, res) => {
    try {
        const { foodId } = req.params;
        const userId = req.user.id;

        const result = await query(
            'DELETE FROM cart_items WHERE user_id = $1 AND food_id = $2 RETURNING *',
            [userId, foodId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart',
                message: 'The item you are trying to remove is not in your cart'
            });
        }

        res.json({
            success: true,
            message: 'Item removed from cart',
            foodId
        });

    } catch (error) {
        console.error('❌ Remove from cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove from cart',
            message: 'An error occurred while removing item from cart'
        });
    }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        res.json({
            success: true,
            message: 'Cart cleared'
        });

    } catch (error) {
        console.error('❌ Clear cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cart',
            message: 'An error occurred while clearing your cart'
        });
    }
});

module.exports = router;