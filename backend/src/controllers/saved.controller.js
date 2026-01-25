import { query } from '../config/database.js';

// 1. Хадгалсан бүх хоолыг авах
export const getSavedFoods = async (req, res) => {
    const userId = req.user.id;

    const result = await query(`
        SELECT f.id, f.name, f.description, f.image_url AS image, f.price, 
               f.restaurant_id, f.rating, f.delivery_time
        FROM saved_foods sf
        JOIN foods f ON sf.food_id = f.id
        WHERE sf.user_id = $1
        ORDER BY sf.created_at DESC
    `, [userId]);

    res.json({
        success: true,
        data: result.rows
    });
};

// 2. Хадгалах (Дуртай хоолоор тэмдэглэх)
export const addToSaved = async (req, res) => {
    const userId = req.user.id;
    const { foodId } = req.params;

    // ON CONFLICT DO NOTHING нь хэрэв аль хэдийн хадгалсан бол алдаа заахгүй
    await query(`
        INSERT INTO saved_foods (user_id, food_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `, [userId, foodId]);

    res.json({
        success: true,
        message: 'Food added to saved items'
    });
};

// 3. Хадгалснаас хасах
export const removeFromSaved = async (req, res) => {
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
};