import { query } from '../config/database.js';
import { validationResult } from 'express-validator';

// 1. Сагсан дахь бүх зүйлийг авах
export const getCart = async (req, res) => {
    const userId = req.user.id;

    const result = await query(`
        SELECT 
            ci.food_id as id, ci.quantity, f.name, f.description,
            f.price, f.image_url, f.rating, f.delivery_time,
            r.name as restaurant_name
        FROM cart_items ci
        JOIN foods f ON ci.food_id = f.id
        LEFT JOIN restaurants r ON f.restaurant_id = r.id
        WHERE ci.user_id = $1
        ORDER BY ci.added_at DESC
    `, [userId]);

    const cartItems = result.rows.map(item => ({
        ...item,
        price: parseFloat(item.price),
        rating: parseFloat(item.rating),
        restaurant: item.restaurant_name
    }));

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
        success: true,
        data: {
            items: cartItems,
            total: parseFloat(total.toFixed(2)),
            itemCount
        }
    });
};

// 2. Сагсанд хоол нэмэх
export const addToCart = async (req, res) => {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
    }

    const { foodId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Хоол байгаа эсэхийг шалгах
    const foodResult = await query('SELECT id FROM foods WHERE id = $1', [foodId]);
    if (foodResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Food not found' });
    }

    // Өмнө нь сагсанд байсан эсэхийг шалгах
    const existing = await query(
        'SELECT quantity FROM cart_items WHERE user_id = $1 AND food_id = $2',
        [userId, foodId]
    );

    if (existing.rows.length > 0) {
        const newQuantity = existing.rows[0].quantity + quantity;
        await query(
            'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND food_id = $3',
            [newQuantity, userId, foodId]
        );
    } else {
        await query(
            'INSERT INTO cart_items (user_id, food_id, quantity) VALUES ($1, $2, $3)',
            [userId, foodId, quantity]
        );
    }

    res.json({ success: true, message: 'Item added to cart', foodId });
};

// 3. Тоо ширхэг шинэчлэх
export const updateCartItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, details: errors.array() });

    const { foodId, quantity } = req.body;
    const userId = req.user.id;

    if (quantity === 0) {
        await query('DELETE FROM cart_items WHERE user_id = $1 AND food_id = $2', [userId, foodId]);
        return res.json({ success: true, message: 'Item removed', action: 'removed' });
    }

    const result = await query(
        'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND food_id = $3 RETURNING *',
        [quantity, userId, foodId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }

    res.json({ success: true, message: 'Cart updated', foodId, quantity });
};

// 4. Сагснаас нэг зүйл устгах
export const removeFromCart = async (req, res) => {
    const { foodId } = req.params;
    const userId = req.user.id;

    const result = await query(
        'DELETE FROM cart_items WHERE user_id = $1 AND food_id = $2 RETURNING *',
        [userId, foodId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, message: 'Item removed' });
};

// 5. Сагсыг бүхэлд нь цэвэрлэх
export const clearCart = async (req, res) => {
    await query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    res.json({ success: true, message: 'Cart cleared' });
};