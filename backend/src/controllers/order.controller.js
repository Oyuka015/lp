import { query, getClient } from '../config/database.js';
import { validationResult } from 'express-validator';

// 1. Хэрэглэгчийн бүх захиалгыг авах
export const getOrders = async (req, res) => {
    const userId = req.user.id;
    const { status, limit = 10, offset = 0 } = req.query;

    let baseQuery = `
        SELECT o.* FROM orders o WHERE o.user_id = $1
    `;
    const params = [userId];
    let paramIndex = 2;

    if (status) {
        baseQuery += ` AND o.status = $${paramIndex++}`;
        params.push(status);
    }

    baseQuery += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const ordersResult = await query(baseQuery, params);
    
    // Захиалга бүрийн хоолнуудыг (items) нэмж авах
    const orders = await Promise.all(ordersResult.rows.map(async (order) => {
        const itemsResult = await query(`
            SELECT oi.*, f.name as food_name, f.image_url 
            FROM order_items oi 
            JOIN foods f ON oi.food_id = f.id 
            WHERE oi.order_id = $1
        `, [order.id]);

        return {
            ...order,
            totalAmount: parseFloat(order.total_amount),
            itemCount: itemsResult.rows.length,
            items: itemsResult.rows.map(item => ({
                ...item,
                unitPrice: parseFloat(item.unit_price),
                subtotal: parseFloat(item.subtotal)
            }))
        };
    }));

    res.json({ success: true, data: orders, count: orders.length });
};

// 2. Ганц захиалгыг ID-аар авах
export const getOrderById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const orderResult = await query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);
    if (orderResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Захиалга олдсонгүй' });
    }

    const itemsResult = await query(`
        SELECT oi.*, f.name as food_name, f.image_url 
        FROM order_items oi 
        JOIN foods f ON oi.food_id = f.id 
        WHERE oi.order_id = $1
    `, [id]);

    res.json({ 
        success: true, 
        data: { 
            ...orderResult.rows[0], 
            totalAmount: parseFloat(orderResult.rows[0].total_amount),
            items: itemsResult.rows 
        } 
    });
};

// 3. Шинэ захиалга үүсгэх (Транзакцитай)
export const createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, details: errors.array() });

    const userId = req.user.id;
    const { deliveryAddress, notes } = req.body;

    // Сагсан дахь хоолнуудыг авах
    const cartResult = await query(`
        SELECT ci.*, f.price, f.name FROM cart_items ci 
        JOIN foods f ON ci.food_id = f.id WHERE ci.user_id = $1
    `, [userId]);

    if (cartResult.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Сагс хоосон байна' });
    }

    const total = cartResult.rows.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const finalTotal = total + 2.99; // Хүргэлтийн хураамж нэмэв

    const client = await getClient(); // DB Client авах

    try {
        await client.query('BEGIN');

        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const orderRes = await client.query(`
            INSERT INTO orders (user_id, order_number, total_amount, delivery_address, notes) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [userId, orderNumber, finalTotal, deliveryAddress || req.user.address, notes]);

        const order = orderRes.rows[0];

        for (const item of cartResult.rows) {
            await client.query(`
                INSERT INTO order_items (order_id, food_id, quantity, unit_price, subtotal) 
                VALUES ($1, $2, $3, $4, $5)
            `, [order.id, item.food_id, item.quantity, item.price, (parseFloat(item.price) * item.quantity)]);
        }

        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
        await client.query('COMMIT');

        res.status(201).json({ success: true, order });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// 4. Төлөв шинэчлэх
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
        'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Захиалга олдсонгүй' });
    res.json({ success: true, order: result.rows[0] });
};

// 5. Захиалга цуцлах (Зөвхөн Pending үед)
export const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await query('SELECT status FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);
    if (order.rows.length === 0) return res.status(404).json({ success: false, message: 'Олдсонгүй' });
    if (order.rows[0].status !== 'pending') return res.status(400).json({ success: false, message: 'Зөвхөн хүлээгдэж буй захиалгыг цуцлах боломжтой' });

    await query("UPDATE orders SET status = 'cancelled' WHERE id = $1", [id]);
    res.json({ success: true, message: 'Захиалга цуцлагдлаа' });
};