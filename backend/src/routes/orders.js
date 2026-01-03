const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, limit = 10, offset = 0 } = req.query;

        let baseQuery = `
            SELECT 
                o.id, o.order_number, o.total_amount, o.status, o.delivery_address, o.notes,
                o.created_at, o.updated_at
            FROM orders o
            WHERE o.user_id = $1
        `;
        const params = [userId];
        let paramIndex = 2;

        if (status) {
            baseQuery += ` AND o.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        baseQuery += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), parseInt(offset));

        const ordersResult = await query(baseQuery, params);

        const orders = [];
        for (const order of ordersResult.rows) {
            const itemsResult = await query(`
                SELECT 
                    oi.id, oi.quantity, oi.unit_price, oi.subtotal,
                    f.id as food_id, f.name as food_name, f.image_url
                FROM order_items oi
                JOIN foods f ON oi.food_id = f.id
                WHERE oi.order_id = $1
            `, [order.id]);

            orders.push({
                id: order.id,
                orderNumber: order.order_number,
                totalAmount: parseFloat(order.total_amount),
                status: order.status,
                deliveryAddress: order.delivery_address,
                notes: order.notes,
                itemCount: itemsResult.rows.length,
                items: itemsResult.rows.map(item => ({
                    id: item.id,
                    foodId: item.food_id,
                    name: item.food_name,
                    image: item.image_url,
                    quantity: item.quantity,
                    unitPrice: parseFloat(item.unit_price),
                    subtotal: parseFloat(item.subtotal)
                })),
                createdAt: order.created_at,
                updatedAt: order.updated_at
            });
        }

        res.json({
            success: true,
            data: orders,
            count: orders.length,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });

    } catch (error) {
        console.error('❌ Get orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders',
            message: 'An error occurred while fetching your orders'
        });
    }
});


router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const orderResult = await query(`
            SELECT 
                o.id, o.order_number, o.total_amount, o.status, o.delivery_address, o.notes,
                o.created_at, o.updated_at
            FROM orders o
            WHERE o.id = $1 AND o.user_id = $2
        `, [id, userId]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
                message: 'The order you are looking for was not found'
            });
        }

        const order = orderResult.rows[0];

        const itemsResult = await query(`
            SELECT 
                oi.id, oi.quantity, oi.unit_price, oi.subtotal,
                f.id as food_id, f.name as food_name, f.image_url
            FROM order_items oi
            JOIN foods f ON oi.food_id = f.id
            WHERE oi.order_id = $1
        `, [id]);

        const orderData = {
            id: order.id,
            orderNumber: order.order_number,
            totalAmount: parseFloat(order.total_amount),
            status: order.status,
            deliveryAddress: order.delivery_address,
            notes: order.notes,
            items: itemsResult.rows.map(item => ({
                id: item.id,
                foodId: item.food_id,
                name: item.food_name,
                image: item.image_url,
                quantity: item.quantity,
                unitPrice: parseFloat(item.unit_price),
                subtotal: parseFloat(item.subtotal)
            })),
            createdAt: order.created_at,
            updatedAt: order.updated_at
        };

        res.json({
            success: true,
            data: orderData
        });

    } catch (error) {
        console.error('❌ Get order error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order',
            message: 'An error occurred while fetching the order'
        });
    }
});

router.post('/', [
    authenticateToken,
    body('deliveryAddress').optional().trim().isLength({ max: 500 }),
    body('notes').optional().trim().isLength({ max: 1000 })
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
        const { deliveryAddress, notes } = req.body;

        // Get user's cart
        const cartResult = await query(`
            SELECT 
                ci.food_id,
                ci.quantity,
                f.price,
                f.name
            FROM cart_items ci
            JOIN foods f ON ci.food_id = f.id
            WHERE ci.user_id = $1
        `, [userId]);

        if (cartResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty',
                message: 'Cannot create order with empty cart'
            });
        }

        // Calculate total
        const total = cartResult.rows.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);

        // Add delivery fee (mock)
        const finalTotal = total + 2.99;

        // Start transaction
        const client = await require('../config/database').getClient();

        try {
            await client.query('BEGIN');

            // Create order
            const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const orderResult = await client.query(`
                INSERT INTO orders (user_id, order_number, total_amount, delivery_address, notes) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING id, order_number, total_amount, status, created_at
            `, [userId, orderNumber, finalTotal, deliveryAddress || req.user.address, notes]);

            const order = orderResult.rows[0];

            // Create order items
            for (const item of cartResult.rows) {
                const subtotal = parseFloat(item.price) * item.quantity;
                await client.query(`
                    INSERT INTO order_items (order_id, food_id, quantity, unit_price, subtotal) 
                    VALUES ($1, $2, $3, $4, $5)
                `, [order.id, item.food_id, item.quantity, item.price, subtotal]);
            }

            // Clear cart
            await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

            await client.query('COMMIT');

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order: {
                    id: order.id,
                    orderNumber: order.order_number,
                    totalAmount: parseFloat(order.total_amount),
                    status: order.status,
                    createdAt: order.created_at
                }
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('❌ Create order error:', error);
        res.status(500).json({
            success: false,
            error: 'Order creation failed',
            message: 'An error occurred while creating your order'
        });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (for admin/manager)
// @access  Private
router.put('/:id/status', [
    authenticateToken,
    body('status').isIn(['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'])
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

        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const result = await query(`
            UPDATE orders 
            SET status = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2 AND user_id = $3 
            RETURNING id, order_number, status, updated_at
        `, [status, id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
                message: 'The order you are trying to update was not found'
            });
        }

        const order = result.rows[0];

        res.json({
            success: true,
            message: 'Order status updated',
            order: {
                id: order.id,
                orderNumber: order.order_number,
                status: order.status,
                updatedAt: order.updated_at
            }
        });

    } catch (error) {
        console.error('❌ Update order status error:', error);
        res.status(500).json({
            success: false,
            error: 'Update failed',
            message: 'An error occurred while updating order status'
        });
    }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel order (if still pending)
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if order exists and is pending
        const orderResult = await query(
            'SELECT status FROM orders WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
                message: 'The order you are trying to cancel was not found'
            });
        }

        if (orderResult.rows[0].status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'Cannot cancel order',
                message: 'Only pending orders can be cancelled'
            });
        }

        // Update order status to cancelled
        await query(`
            UPDATE orders 
            SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND user_id = $2
        `, [id, userId]);

        res.json({
            success: true,
            message: 'Order cancelled successfully'
        });

    } catch (error) {
        console.error('❌ Cancel order error:', error);
        res.status(500).json({
            success: false,
            error: 'Cancellation failed',
            message: 'An error occurred while cancelling the order'
        });
    }
});

module.exports = router;