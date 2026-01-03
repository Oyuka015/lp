const express = require('express');
const { query } = require('../config/database');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
    try {
        const { category, search, restaurant, minPrice, maxPrice, sort } = req.query;
        
        let baseQuery = `
            SELECT 
                f.id, f.name, f.description, f.price, f.image_url, f.rating, f.delivery_time,
                c.name as category_name, c.slug as category_slug, c.icon as category_icon,
                r.name as restaurant_name, r.id as restaurant_id
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            LEFT JOIN restaurants r ON f.restaurant_id = r.id
            WHERE 1=1
        `;
        
        const params = [];
        let paramIndex = 1;

        // Category filter
        if (category && category !== 'all') {
            baseQuery += ` AND c.slug = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        // Search filter
        if (search) {
            baseQuery += ` AND (f.name ILIKE $${paramIndex} OR f.description ILIKE $${paramIndex} OR r.name ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Restaurant filter
        if (restaurant) {
            baseQuery += ` AND r.id = $${paramIndex}`;
            params.push(restaurant);
            paramIndex++;
        }

        // Price range filter
        if (minPrice) {
            baseQuery += ` AND f.price >= $${paramIndex}`;
            params.push(parseFloat(minPrice));
            paramIndex++;
        }

        if (maxPrice) {
            baseQuery += ` AND f.price <= $${paramIndex}`;
            params.push(parseFloat(maxPrice));
            paramIndex++;
        }

        // Sorting
        let orderBy = 'f.created_at DESC';
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    orderBy = 'f.price ASC';
                    break;
                case 'price_desc':
                    orderBy = 'f.price DESC';
                    break;
                case 'rating':
                    orderBy = 'f.rating DESC';
                    break;
                case 'name':
                    orderBy = 'f.name ASC';
                    break;
                default:
                    orderBy = 'f.created_at DESC';
            }
        }

        baseQuery += ` ORDER BY ${orderBy}`;

        const result = await query(baseQuery, params);
        
        // Check if user is logged in and get saved foods
        let savedFoodIds = [];
        if (req.user) {
            const savedResult = await query(
                'SELECT food_id FROM saved_foods WHERE user_id = $1',
                [req.user.id]
            );
            savedFoodIds = savedResult.rows.map(row => row.food_id);
        }

        // Format response
        const foods = result.rows.map(food => ({
            id: food.id,
            name: food.name,
            description: food.description,
            price: parseFloat(food.price),
            image: food.image_url,
            rating: parseFloat(food.rating),
            deliveryTime: food.delivery_time,
            category: {
                name: food.category_name,
                slug: food.category_slug,
                icon: food.category_icon
            },
            restaurant: {
                id: food.restaurant_id,
                name: food.restaurant_name
            },
            isSaved: savedFoodIds.includes(food.id)
        }));

        res.json({
            success: true,
            data: foods,
            count: foods.length
        });

    } catch (error) {
        console.error('❌ Get foods error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch foods',
            message: 'An error occurred while fetching food items'
        });
    }
});

// @route   GET /api/foods/:id
// @desc    Get single food by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT 
                f.id, f.name, f.description, f.price, f.image_url, f.rating, f.delivery_time,
                c.name as category_name, c.slug as category_slug, c.icon as category_icon,
                r.name as restaurant_name, r.description as restaurant_description,
                r.address as restaurant_address, r.phone as restaurant_phone
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            LEFT JOIN restaurants r ON f.restaurant_id = r.id
            WHERE f.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Food not found',
                message: 'The requested food item was not found'
            });
        }

        const food = result.rows[0];

        // Check if saved by current user
        let isSaved = false;
        if (req.user) {
            const savedResult = await query(
                'SELECT 1 FROM saved_foods WHERE user_id = $1 AND food_id = $2',
                [req.user.id, id]
            );
            isSaved = savedResult.rows.length > 0;
        }

        res.json({
            success: true,
            data: {
                id: food.id,
                name: food.name,
                description: food.description,
                price: parseFloat(food.price),
                image: food.image_url,
                rating: parseFloat(food.rating),
                deliveryTime: food.delivery_time,
                category: {
                    name: food.category_name,
                    slug: food.category_slug,
                    icon: food.category_icon
                },
                restaurant: {
                    name: food.restaurant_name,
                    description: food.restaurant_description,
                    address: food.restaurant_address,
                    phone: food.restaurant_phone
                },
                isSaved
            }
        });

    } catch (error) {
        console.error('❌ Get food error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch food',
            message: 'An error occurred while fetching the food item'
        });
    }
});

// @route   GET /api/foods/categories
// @desc    Get all categories
// @access  Public
router.get('/categories/all', async (req, res) => {
    try {
        const result = await query(
            'SELECT id, name, slug, icon FROM categories ORDER BY name ASC'
        );

        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });

    } catch (error) {
        console.error('❌ Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories',
            message: 'An error occurred while fetching categories'
        });
    }
});

// @route   POST /api/foods/:id/save
// @desc    Save/unsave a food item
// @access  Private
router.post('/:id/save', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if food exists
        const foodResult = await query('SELECT id FROM foods WHERE id = $1', [id]);
        if (foodResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Food not found',
                message: 'The food item you are trying to save was not found'
            });
        }

        // Check if already saved
        const savedResult = await query(
            'SELECT 1 FROM saved_foods WHERE user_id = $1 AND food_id = $2',
            [userId, id]
        );

        let action, message;

        if (savedResult.rows.length > 0) {
            // Remove from saved
            await query(
                'DELETE FROM saved_foods WHERE user_id = $1 AND food_id = $2',
                [userId, id]
            );
            action = 'removed';
            message = 'Food removed from saved items';
        } else {
            // Add to saved
            await query(
                'INSERT INTO saved_foods (user_id, food_id) VALUES ($1, $2)',
                [userId, id]
            );
            action = 'saved';
            message = 'Food added to saved items';
        }

        res.json({
            success: true,
            action,
            message
        });

    } catch (error) {
        console.error('❌ Save food error:', error);
        res.status(500).json({
            success: false,
            error: 'Operation failed',
            message: 'An error occurred while saving the food item'
        });
    }
});

// @route   GET /api/foods/saved
// @desc    Get user's saved foods
// @access  Private
router.get('/saved/all', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(`
            SELECT 
                f.id, f.name, f.description, f.price, f.image_url, f.rating, f.delivery_time,
                c.name as category_name, c.slug as category_slug, c.icon as category_icon,
                r.name as restaurant_name, r.id as restaurant_id,
                sf.created_at as saved_at
            FROM saved_foods sf
            JOIN foods f ON sf.food_id = f.id
            LEFT JOIN categories c ON f.category_id = c.id
            LEFT JOIN restaurants r ON f.restaurant_id = r.id
            WHERE sf.user_id = $1
            ORDER BY sf.created_at DESC
        `, [userId]);

        const savedFoods = result.rows.map(food => ({
            id: food.id,
            name: food.name,
            description: food.description,
            price: parseFloat(food.price),
            image: food.image_url,
            rating: parseFloat(food.rating),
            deliveryTime: food.delivery_time,
            category: {
                name: food.category_name,
                slug: food.category_slug,
                icon: food.category_icon
            },
            restaurant: {
                id: food.restaurant_id,
                name: food.restaurant_name
            },
            savedAt: food.saved_at,
            isSaved: true
        }));

        res.json({
            success: true,
            data: savedFoods,
            count: savedFoods.length
        });

    } catch (error) {
        console.error('❌ Get saved foods error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch saved foods',
            message: 'An error occurred while fetching your saved foods'
        });
    }
});

module.exports = router;