import { query, getClient } from '../config/database.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

// 1. Хэрэглэгчийн профайл болон статистик авах
export const getProfile = async (req, res) => {
    const userId = req.user.id;

    // Профайл мэдээлэл авах
    const userResult = await query(
        'SELECT id, name, email, phone, address, created_at FROM users WHERE id = $1',
        [userId]
    );

    if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Статистик авах (Нийт захиалга, хадгалсан хоол, зарцуулсан дүн)
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
            user: userResult.rows[0],
            stats: {
                orderCount: parseInt(stats.order_count),
                savedCount: parseInt(stats.saved_count),
                totalSpent: parseFloat(stats.total_spent)
            }
        }
    });
};

// 2. Профайл мэдээлэл шинэчлэх (Динамик SQL)
export const updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, details: errors.array() });

    const userId = req.user.id;
    const { name, phone, address } = req.body;

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name) { updates.push(`name = $${paramIndex++}`); params.push(name); }
    if (phone) { updates.push(`phone = $${paramIndex++}`); params.push(phone); }
    if (address) { updates.push(`address = $${paramIndex++}`); params.push(address); }

    if (updates.length === 0) {
        return res.status(400).json({ success: false, message: 'Provide at least one field' });
    }

    params.push(userId);
    const result = await query(`
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramIndex} 
        RETURNING id, name, email, phone, address, updated_at
    `, params);

    res.json({ success: true, message: 'Profile updated', user: result.rows[0] });
};

// 3. Нууц үг солих
export const changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, details: errors.array() });

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);

    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Одоогийн нууц үг буруу байна' });
    }

    const saltRounds = 12;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newHash, userId]);

    res.json({ success: true, message: 'Password changed successfully' });
};

// 4. Аккаунт устгах (Транзакцитай)
export const deleteAccount = async (req, res) => {
    const userId = req.user.id;
    const client = await getClient();

    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM saved_foods WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM users WHERE id = $1', [userId]);
        await client.query('COMMIT');

        res.json({ success: true, message: 'Account deleted' });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};